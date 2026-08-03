import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * ==========================================================
 * Authentication Middleware
 * ==========================================================
 * Verifies the JWT stored inside the HTTP-only cookie.
 *
 * Cookie Name:
 * token
 *
 * If valid:
 *      req.user = authenticated user
 *
 * Otherwise:
 *      Return 401 Unauthorized
 * ==========================================================
 */

export const authenticateUser = async (req, res, next) => {
  try {

    /**
     * ----------------------------------------------------------
     * Read JWT from Cookie
     * ----------------------------------------------------------
     */
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    /**
     * ----------------------------------------------------------
     * Verify JWT
     * ----------------------------------------------------------
     */
    const decoded = verifyToken(token);

    /**
     * ----------------------------------------------------------
     * Find User
     * ----------------------------------------------------------
     */
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    /**
     * ----------------------------------------------------------
     * Check Account Status
     * ----------------------------------------------------------
     */
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    /**
     * ----------------------------------------------------------
     * Attach User to Request
     * ----------------------------------------------------------
     */
    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });

  }
};