import api from "./api";

/**
 * ==========================================================
 * Get Logged-in User Documents
 * ==========================================================
 */
export const getUserDocuments = async () => {

  try {

    const response = await api.get("/documents");

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch documents.",
      }
    );

  }

};

/**
 * ==========================================================
 * Delete Document
 * ==========================================================
 */

export const deleteDocument = async (docId) => {

  try {

    const response = await api.delete(
      `/documents/${docId}`
    );

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to delete document.",
      }
    );

  }

};