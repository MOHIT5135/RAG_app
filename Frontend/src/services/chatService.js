import api from "./api";
import chatConfig from "../data/chatConfig";

console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);


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