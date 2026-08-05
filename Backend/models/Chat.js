import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sources: [
      {
        number: Number,
        text: String,
        fileName: String,
        chunkIndex: Number,
        distance: Number,
        retrievalMethod: String,
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    /**
     * Owner
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Document associated with this conversation
     */
    documentId: {
      type: String,
      required: true,
      index: true,
    },

    /**
     * Chat title
     * Example:
     * "Summarize Resume"
     * "Explain JWT"
     */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    /**
     * Conversation messages
     */
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);