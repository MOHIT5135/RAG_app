import express from "express";
import { answerWithCitations } from "../services/chatServices.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, fileName } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "`query` is required and must be a string."
      });
    }

    const result = await answerWithCitations(query, fileName);

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;