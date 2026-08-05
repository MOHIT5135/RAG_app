import api from "./api";
import chatConfig from "../data/chatConfig";

export const askQuestion = async ({
  query,
  documentId,
  totalChunks,
  chatId,
}) => {
  try {
    const response = await api.post(chatConfig.askEndpoint, {
      query,
      documentId,
      totalChunks,
      chatId,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );
  }
};