import axios from "axios";
import chatConfig from "../data/chatConfig";

console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const askQuestion = async (
  query,
  documentId,
  totalChunks
) => {

  try {

    const response = await api.post(
      chatConfig.askEndpoint,
      {
        query,
        documentId,
        totalChunks,
      }
    );

    return response.data;

  } catch (error) {

    console.error("Chat Service Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong.",
      }
    );

  }

};