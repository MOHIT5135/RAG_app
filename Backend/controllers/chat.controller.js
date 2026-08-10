import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { answerWithCitations } from "../services/chatServices.js";

/**
 * ==========================================================
 * Ask Question
 * ==========================================================
 */
export const askQuestion = async (req, res) => {
  try {
    const { query, documentId, totalChunks, chatId } = req.body;
    // Handles both string ("doc_123") and string[] (["doc_123", "doc_456"])
    const docIds = Array.isArray(documentId) ? documentId : documentId ? [documentId] : null;
    

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "`query` is required and must be a string.",
      });
    }

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required.",
      });
    }

    // Safely extract userId from middleware context
    const userId = req.user?._id ? req.user._id.toString() : req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    /**
     * ======================================================
     * Create / Find Chat
     * ======================================================
     */
    let chat;

    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        userId: req.user._id,
      });

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }
    } else {
      const title = query.length > 50 ? `${query.substring(0, 50)}...` : query;

      chat = await Chat.create({
        userId: req.user._id,
        documentId,
        title,
      });
    }

    /**
     * ======================================================
     * Save User Message
     * ======================================================
     */
    await Message.create({
      chatId: chat._id,
      role: "user",
      content: query,
    });

    /**
     * ======================================================
     * Generate AI Response
     * ======================================================
     */
    let result;

    try {
      const priorMessages = chatId
        ? await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(10) // last N turns
        : [];

      const history = priorMessages.map((m) => ({ role: m.role, content: m.content }));

      result = await answerWithCitations({
        userInput: query,
        documentId: docIds,
        totalChunks: totalChunks || 10,
        userId,
        history,
        onToken: (token) => {
          res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
          
          // NEW: Force Express/compression middleware to push the chunk over the network immediately
          if (res.flush) {
            res.flush();
          }
        },
      });
      console.log(result);
    } catch (error) {
      /**
       * Save assistant error
       */
      await Message.create({
        chatId: chat._id,
        role: "assistant",
        content: "Sorry, I couldn't generate a response at the moment.",
      });

      chat.lastMessageAt = new Date();
      await chat.save();

      throw error;
    }

    /**
     * ======================================================
     * Save Assistant Message
     * ======================================================
     */
    await Message.create({
      chatId: chat._id,
      role: "assistant",
      content: result.answer,
      sources: result.sources || [],
    });

    /**
     * ======================================================
     * Update Chat Timestamp
     * ======================================================
     */
    chat.lastMessageAt = new Date();
    await chat.save();

    /**
     * ======================================================
     * Response
     * ======================================================
     */
    res.write(
      `data: ${JSON.stringify({
        type: "done",
        chatId: chat._id,
        answer: result.answer,
        sources: result.sources,
        standaloneQuestion: result.standaloneQuestion,
        topKUsed: result.topKUsed,
      })}\n\n`
    );

    return res.end();

  } catch (error) {
    console.error("FULL ERROR DETAILS:", error);
    
    // If the stream already started, send an error event over the stream
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
      return res.end();
    } 
    
    // If the stream hasn't started yet, it's safe to send a standard 500 JSON response
    return res.status(500).json({ success: false, message: error.message });
  }
};