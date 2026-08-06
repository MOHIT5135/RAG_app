import express from "express";
import { answerWithCitations } from "../services/chatServices.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Document from "../models/Document.js";
const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { query, documentId } = req.body;
    // Authenticated user ID from middleware
    const userId = req.user?._id ? req.user._id.toString() : req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found on request context."
      });
    }
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "`query` is required and must be a string."
      });
    }
    
    let totalChunks = null;
    let ownedDocId = null;

    if (documentId) {
      // Ownership check: this documentId must actually belong to the requesting user.
      const doc = await Document.findOne({ docId: documentId, userId });

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Document not found, or you don't have access to it."
        });
      }

      ownedDocId = doc.docId;
      totalChunks = doc.totalChunks;
    } else {
      // "search all" mode — sum chunks across ALL of this user's own documents only.
      const allUserDocs = await Document.find({ userId });
      totalChunks = allUserDocs.reduce((sum, d) => sum + (d.totalChunks || 0), 0);
    }
    
    const result = await answerWithCitations(query, ownedDocId, totalChunks, userId);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
});
export default router;