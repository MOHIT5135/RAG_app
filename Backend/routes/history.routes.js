import express from "express";

import {
  getChatHistory,
  getChatConversation,
  deleteChatConversation,
} from "../controllers/history.controller.js";

import {
  authenticateUser,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ==========================================================
 * Get User Chat History
 * ==========================================================
 */

router.get(
  "/",
  authenticateUser,
  getChatHistory
);

/**
 * ==========================================================
 * Get Single Conversation
 * ==========================================================
 */

router.get(
  "/:chatId",
  authenticateUser,
  getChatConversation
);

/**
 * ==========================================================
 * Delete Conversation
 * ==========================================================
 */

router.delete(
  "/:chatId",
  authenticateUser,
  deleteChatConversation
);

export default router;