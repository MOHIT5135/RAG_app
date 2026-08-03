import jwt from "jsonwebtoken";

/**
 * ==========================================================
 * Generate JWT Token
 * ==========================================================
 * Creates a signed JWT containing the user's id.
 *
 * @param {String} userId
 * @returns {String}
 * ==========================================================
 */
export const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * ==========================================================
 * Verify JWT Token
 * ==========================================================
 * Decodes and verifies a JWT.
 *
 * @param {String} token
 * @returns {Object}
 * ==========================================================
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};