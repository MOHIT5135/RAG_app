import { useState } from "react";
import { useChatHistory } from "@/context/ChatHistoryContext";

import { askQuestion } from "../services/chatService";
import {
  createAssistantMessage,
  createUserMessage,
} from "../utils/messageFormatter";

const useChat = (activeDocument = null) => {

  const {
    messages,
    setMessages,
    selectedChat,
    setSelectedChat,
    refreshHistory,
  } = useChatHistory();

  const [sources, setSources] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ==========================================================
   * Current Conversation
   * ==========================================================
   */

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

      const response = await askQuestion({

        query,

        documentId: activeDocument.docId,

        totalChunks: activeDocument.totalChunks,

        chatId: selectedChat?._id || null,

      });

      if (response.chatId && !selectedChat) {

        setSelectedChat({
          _id: response.chatId,
        });

        await refreshHistory();

      }

      /**
       * Store chatId returned by backend.
       * First message creates a chat.
       * Remaining messages reuse it.
       */

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
   * New Chat
   * ==========================================================
   */

  const clearChat = () => {

    setMessages([]);
    setSources([]);
    setSelectedChat(null);
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