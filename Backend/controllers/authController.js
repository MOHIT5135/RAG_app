import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/authService.js";

import { generateToken } from "../utils/jwt.js";

/**
 * ==========================================================
 * Cookie Configuration
 * ==========================================================
 */
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // must be true whenever sameSite is "none"
  sameSite: isProduction ? "none" : "lax", // "none" required for cross-domain (Netlify -> Render)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

/**
 * ==========================================================
 * Register User
 * POST /api/auth/signup
 * ==========================================================
 */
export const signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * ==========================================================
 * Login User
 * POST /api/auth/login
 * ==========================================================
 */
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await loginUser({
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * ==========================================================
 * Current Logged-In User
 * GET /api/auth/me
 * ==========================================================
 */
export const getProfile = async (req, res) => {
  try {

    const user = await getUserProfile(req.user._id);

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * ==========================================================
 * Logout User
 * POST /api/auth/logout
 * ==========================================================
 */
export const logout = (req, res) => {

  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });

};