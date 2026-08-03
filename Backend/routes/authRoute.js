import express from "express";

import {
  signup,
  login,
  logout,
  getProfile,
} from "../controllers/authController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ==========================================================
 * Authentication Routes
 * ==========================================================
 */

/**
 * ----------------------------------------------------------
 * Register User
 * POST /api/auth/signup
 * ----------------------------------------------------------
 */
router.post("/signup", signup);

/**
 * ----------------------------------------------------------
 * Login User
 * POST /api/auth/login
 * ----------------------------------------------------------
 */
router.post("/login", login);

/**
 * ----------------------------------------------------------
 * Logout User
 * POST /api/auth/logout
 * ----------------------------------------------------------
 */
router.post("/logout", logout);

/**
 * ----------------------------------------------------------
 * Current Logged In User
 * GET /api/auth/me
 * Protected Route
 * ----------------------------------------------------------
 */
router.get("/me", authenticateUser, getProfile);

export default router;