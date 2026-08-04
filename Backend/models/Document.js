import mongoose from "mongoose";

/**
 * ==========================================================
 * Document Schema
 * ==========================================================
 * Each uploaded file belongs to one authenticated user.
 *
 * Flow:
 * User
 *   ↓
 * Upload Document
 *   ↓
 * ChromaDB (Embeddings)
 *   ↓
 * MongoDB (Metadata)
 *
 * MongoDB stores only lightweight metadata.
 * ChromaDB stores embeddings.
 * ==========================================================
 */

const documentSchema = new mongoose.Schema(
  {
    /**
     * ======================================================
     * Owner of this document
     * ======================================================
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * ======================================================
     * Unique document id used inside ChromaDB
     * ======================================================
     */
    docId: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * ======================================================
     * Original uploaded filename
     * ======================================================
     */
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * ======================================================
     * Number of chunks generated
     * ======================================================
     */
    totalChunks: {
      type: Number,
      required: true,
      min: 1,
    },

    /**
     * ======================================================
     * Upload timestamp
     * ======================================================
     */
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Document", documentSchema);