import mongoose from "mongoose";

/**
 * ==========================================================
 * Message Schema
 * ==========================================================
 * Every user/assistant message belongs to one chat.
 * ==========================================================
 */

const sourceSchema = new mongoose.Schema(
  {
    number: Number,

    text: String,

    fileName: String,

    chunkIndex: Number,

    distance: Number,

    retrievalMethod: String,
  },
  {
    _id: false,
  }
);

const messageSchema = new mongoose.Schema(
  {
    /**
     * Parent Conversation
     */
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    /**
     * Message Sender
     */
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    /**
     * Message Content
     */
    content: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Sources
     * Only assistant messages usually contain citations.
     */
    sources: {
      type: [sourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);