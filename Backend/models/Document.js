// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  totalChunks: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);