import api from "./api";

/**
 * ==========================================================
 * Get All Chat History
 * ==========================================================
 */

export const getChatHistory = async () => {

  try {

    const response = await api.get("/v1/history");

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch chat history.",
      }
    );

  }

};

/**
 * ==========================================================
 * Get Single Conversation
 * ==========================================================
 */

export const getChatConversation = async (chatId) => {

  try {

    const response = await api.get(`/v1/history/${chatId}`);

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch conversation.",
      }
    );

  }

};

/**
 * ==========================================================
 * Delete Conversation
 * ==========================================================
 */

export const deleteChatConversation = async (chatId) => {

  try {

    const response = await api.delete(`/v1/history/${chatId}`);

    return response.data;

  } catch (error) {

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to delete conversation.",
      }
    );

  }

};