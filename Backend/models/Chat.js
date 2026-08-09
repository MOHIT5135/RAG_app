import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    /**
     * Chat Owner
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Selected document
     */
    documentId: {
      type: [String],
      required: true,
      index: true,
    },

    /**
     * Chat Title
     */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    /**
     * Last message timestamp
     * Used for sorting chats in sidebar.
     */
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);