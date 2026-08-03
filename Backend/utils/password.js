import bcrypt from "bcryptjs";

/**
 * ==========================================================
 * Hash Password
 * ==========================================================
 * Encrypts the user's plain text password before storing
 * it in MongoDB.
 *
 * @param {string} password
 * @returns {Promise<string>}
 * ==========================================================
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

/**
 * ==========================================================
 * Compare Password
 * ==========================================================
 * Compares the user's entered password with the hashed
 * password stored in MongoDB.
 *
 * @param {string} enteredPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 * ==========================================================
 */
export const comparePassword = async (
  enteredPassword,
  hashedPassword
) => {
  return await bcrypt.compare(
    enteredPassword,
    hashedPassword
  );
};