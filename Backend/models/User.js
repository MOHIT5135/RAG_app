import mongoose from "mongoose";

/**
 * ==========================================================
 * User Schema
 * ==========================================================
 * Every registered user will have one document.
 *
 * This _id will later be used everywhere:
 * 1. Uploaded Documents
 * 2. ChromaDB Metadata
 * 3. Conversations
 * 4. Messages
 * ==========================================================
 */

const userSchema = new mongoose.Schema(
  {
    /**
     * User's Full Name
     */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    /**
     * Email Address
     * Used for Login
     */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    /**
     * Encrypted Password
     * Never store plain text passwords.
     */
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Hide password from queries by default
    },

    /**
     * Profile Image
     * Optional
     * Can be added later.
     */
    avatar: {
      type: String,
      default: "",
    },

    /**
     * Account Status
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ==========================================================
 * Export User Model
 * ==========================================================
 */

const User = mongoose.model("User", userSchema);

export default User;