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

    const {
      query,
      documentId,
      totalChunks,
      chatId,
    } = req.body;

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

      const title =
        query.length > 50
          ? `${query.substring(0, 50)}...`
          : query;

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

      result = await answerWithCitations(
        query,
        documentId,
        totalChunks
      );

      console.log(result);

    } catch (error) {

      /**
       * Save assistant error
       */

      await Message.create({

        chatId: chat._id,

        role: "assistant",

        content:
          "Sorry, I couldn't generate a response at the moment.",

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

    return res.status(200).json({

      success: true,

      chatId: chat._id,

      answer: result.answer,

      sources: result.sources,

      standaloneQuestion: result.standaloneQuestion,

      topKUsed: result.topKUsed,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};