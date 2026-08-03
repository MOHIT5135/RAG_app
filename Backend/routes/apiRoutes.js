import express from "express";

import authRoutes from "./authRoute.js";
import documentRoutes from "./documentRoute.js";
import chatRoutes from "./chatRoute.js";

const router = express.Router();

/**
 * ==========================================================
 * Authentication Routes
 * ==========================================================
 */
router.use("/auth", authRoutes);

/**
 * ==========================================================
 * Document Routes
 * ==========================================================
 */
router.use("/documents", documentRoutes);

/**
 * ==========================================================
 * Chat Routes
 * ==========================================================
 */
router.use("/chat", chatRoutes);

export default router;