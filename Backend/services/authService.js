import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/**
 * ==========================================================
 * Register New User
 * ==========================================================
 */
export const registerUser = async ({ name, email, password }) => {

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists with this email.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

/**
 * ==========================================================
 * Login User
 * ==========================================================
 */
export const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  return user;
};

/**
 * ==========================================================
 * Get User Profile
 * ==========================================================
 */
export const getUserProfile = async (userId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
};