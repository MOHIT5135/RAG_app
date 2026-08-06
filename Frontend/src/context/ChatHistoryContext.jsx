import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import formatTime from "@/utils/formatTime";

import {
  getChatHistory,
  getChatConversation,
  deleteChatConversation,
} from "@/services/historyService";

/**
 * ==========================================================
 * Chat History Context
 * ==========================================================
 */

const ChatHistoryContext = createContext();

/**
 * ==========================================================
 * Provider
 * ==========================================================
 */

export const ChatHistoryProvider = ({ children }) => {

  const { isAuthenticated } = useAuth();

  /**
   * ----------------------------------------------------------
   * States
   * ----------------------------------------------------------
   */

  const [history, setHistory] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  /**
   * ----------------------------------------------------------
   * Load Sidebar History
   * ----------------------------------------------------------
   */

  const refreshHistory = async () => {

    if (!isAuthenticated) {

      setHistory([]);

      return;

    }

    try {

      setLoading(true);

      const response = await getChatHistory();

      setHistory(response.chats || []);

    } catch (error) {

      console.error(error);

      setHistory([]);

    } finally {

      setLoading(false);

    }

  };

  /**
   * ----------------------------------------------------------
   * Load One Conversation
   * ----------------------------------------------------------
   */

  const loadConversation = async (chatId) => {

  try {

    setLoading(true);

    const response = await getChatConversation(chatId);

    setSelectedChat(response.chat);

    const formattedMessages = response.messages.map((message) => ({

        id: message._id,

        role: message.role,

        content: message.content,

        timestamp: formatTime(message.createdAt),

        sources: message.sources || [],

    }));

    setMessages(formattedMessages);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

  /**
   * ----------------------------------------------------------
   * Delete Conversation
   * ----------------------------------------------------------
   */

  const removeConversation = async (chatId) => {

    try {

      await deleteChatConversation(chatId);

      setHistory((prev) =>
        prev.filter((chat) => chat._id !== chatId)
      );

      if (selectedChat?._id === chatId) {

        setSelectedChat(null);

        setMessages([]);

      }

    } catch (error) {

      console.error(error);

    }

  };

  /**
   * ----------------------------------------------------------
   * Refresh After Login
   * ----------------------------------------------------------
   */

  useEffect(() => {

    refreshHistory();

  }, [isAuthenticated]);

  /**
   * ----------------------------------------------------------
   * Context Value
   * ----------------------------------------------------------
   */

  const value = {

    history,

    loading,

    selectedChat,

    messages,

    refreshHistory,

    loadConversation,

    removeConversation,

    setSelectedChat,

    setMessages,

  };

  return (

    <ChatHistoryContext.Provider value={value}>

      {children}

    </ChatHistoryContext.Provider>

  );

};

/**
 * ==========================================================
 * Custom Hook
 * ==========================================================
 */

export const useChatHistory = () => {

  return useContext(ChatHistoryContext);

};