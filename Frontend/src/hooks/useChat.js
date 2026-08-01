import { useState } from "react";
import { askQuestion } from "../services/chatService";
import {
  createAssistantMessage,
  createUserMessage,
} from "../utils/messageFormatter";

const useChat = (fileName = null) => {
  const [messages, setMessages] = useState([]);
  const [sources, setSources] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (query) => {
    if (!query.trim()) return;

    setError(null);

    // Add user message immediately
    const userMessage = createUserMessage(query);

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const response = await askQuestion(query, fileName);

      const assistantMessage = createAssistantMessage(
        response.answer,
        response.sources || []
      );

      setMessages((prev) => [...prev, assistantMessage]);

      setSources(response.sources || []);
    } catch (err) {
      const errorMessage = createAssistantMessage(
        err.message || "Something went wrong."
      );

      setMessages((prev) => [...prev, errorMessage]);

      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

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