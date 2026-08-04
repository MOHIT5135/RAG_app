import { useState } from "react";

import { askQuestion } from "../services/chatService";
import {
  createAssistantMessage,
  createUserMessage,
} from "../utils/messageFormatter";

const useChat = (activeDocument = null) => {

  const [messages, setMessages] = useState([]);
  const [sources, setSources] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ==========================================================
   * Send Message
   * ==========================================================
   */

  const sendMessage = async (query) => {

    if (!query.trim()) return;

    if (!activeDocument) {

      setError("Please select a document.");

      return;

    }

    setError(null);

    const userMessage = createUserMessage(query);

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {

      const response = await askQuestion(
        query,
        activeDocument.docId,
        activeDocument.totalChunks
      );

      const assistantMessage = createAssistantMessage(
        response.answer,
        response.sources || []
      );

      setMessages((prev) => [...prev, assistantMessage]);

      setSources(response.sources || []);

    } catch (err) {

      const message =
        err?.message ||
        "Something went wrong.";

      const errorMessage =
        createAssistantMessage(message);

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

      setError(message);

    } finally {

      setIsTyping(false);

    }

  };

  /**
   * ==========================================================
   * Clear Chat
   * ==========================================================
   */

  const clearChat = () => {

    setMessages([]);

    setSources([]);

    setError(null);

  };

  return {

    messages,

    sources,

    isTyping,

    error,

    sendMessage,

    clearChat,

  };

};

export default useChat;