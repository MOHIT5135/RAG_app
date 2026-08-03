import api from "./api";

/**
 * ==========================================================
 * Authentication Service
 * ==========================================================
 * Handles all authentication related API calls.
 *
 * Endpoints
 * ----------
 * POST /api/auth/signup
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 * ==========================================================
 */

/**
 * ==========================================================
 * Register New User
 * ==========================================================
 */
export const signup = async (userData) => {
  try {
    const response = await api.post(
      "/auth/signup",
      userData
    );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Signup failed.",
      }
    );

  }
};

/**
 * ==========================================================
 * Login User
 * ==========================================================
 */
export const login = async (credentials) => {
  try {

    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Login failed.",
      }
    );

  }
};

/**
 * ==========================================================
 * Logout User
 * ==========================================================
 */
export const logout = async () => {
  try {

    const response = await api.post("/auth/logout");

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Logout failed.",
      }
    );

  }
};

/**
 * ==========================================================
 * Get Logged In User
 * ==========================================================
 */
export const getCurrentUser = async () => {
  try {

    const response = await api.get("/auth/me");

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch user.",
      }
    );

  }
};