import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

/**
 * ==========================================================
 * Get User Chat History
 * ==========================================================
 */

export const getChatHistory = async (req, res) => {

  try {

    const chats = await Chat.find({

      userId: req.user._id,

    })
      .select(
        "_id title documentId createdAt lastMessageAt"
      )
      .sort({
        lastMessageAt: -1,
      });

    return res.status(200).json({

      success: true,

      totalChats: chats.length,

      chats,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/**
 * ==========================================================
 * Get Single Chat Conversation
 * ==========================================================
 */

export const getChatConversation = async (req, res) => {

  try {

    const { chatId } = req.params;

    /**
     * ----------------------------------------------------------
     * Verify chat belongs to logged-in user
     * ----------------------------------------------------------
     */

    const chat = await Chat.findOne({

      _id: chatId,

      userId: req.user._id,

    });

    if (!chat) {

      return res.status(404).json({

        success: false,

        message: "Conversation not found.",

      });

    }

    /**
     * ----------------------------------------------------------
     * Load Messages
     * ----------------------------------------------------------
     */

    const messages = await Message.find({

      chatId,

    }).sort({

      createdAt: 1,

    });

    return res.status(200).json({

      success: true,

      chat,

      messages,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

/**
 * ==========================================================
 * Delete Chat Conversation
 * ==========================================================
 */

export const deleteChatConversation = async (req, res) => {

  try {

    const { chatId } = req.params;

    /**
     * ----------------------------------------------------------
     * Verify Chat Ownership
     * ----------------------------------------------------------
     */

    const chat = await Chat.findOne({

      _id: chatId,

      userId: req.user._id,

    });

    if (!chat) {

      return res.status(404).json({

        success: false,

        message: "Conversation not found.",

      });

    }

    /**
     * ----------------------------------------------------------
     * Delete All Messages
     * ----------------------------------------------------------
     */

    await Message.deleteMany({

      chatId,

    });

    /**
     * ----------------------------------------------------------
     * Delete Chat
     * ----------------------------------------------------------
     */

    await Chat.findByIdAndDelete(chatId);

    return res.status(200).json({

      success: true,

      message: "Conversation deleted successfully.",

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};