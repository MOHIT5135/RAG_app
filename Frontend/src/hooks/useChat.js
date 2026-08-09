import { useState } from "react";
import { useChatHistory } from "@/context/ChatHistoryContext";

import { askQuestion } from "../services/chatService";
import {
  createAssistantMessage,
  createUserMessage,
} from "../utils/messageFormatter";

const useChat = (selectedDocuments = []) => {
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
   * Send Message
   * ==========================================================
   */

  const sendMessage = async (query) => {
    if (!query.trim()) return;

    if (!selectedDocuments || selectedDocuments.length === 0) {
      setError("Please select at least one document.");
      return;
    }
    setError(null);

    // 1. Only push the user message initially
    const userMessage = createUserMessage(query);
    setMessages((prev) => [...prev, userMessage]);

    // 2. This triggers "Thinking..." UI bubble
    setIsTyping(true);

    // Extract array of docIds and sum total chunks for adaptive topK scaling
    const docIds = selectedDocuments.map((doc) => doc.docId);
    const combinedTotalChunks = selectedDocuments.reduce(
      (sum, doc) => sum + (doc.totalChunks || 0),
      0
    );

    try {
      await askQuestion({
        query,
        documentId: docIds, // Pass array of docIds
        totalChunks: combinedTotalChunks,
        chatId: selectedChat?._id || null,

        onToken: (token) => {
          // 3. The moment text arrives, hide the "Thinking..." bubble!
          setIsTyping(false); 

          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            // 4. If the last message is still the user's, this is the FIRST token. 
            // Create the assistant message dynamically.
            if (lastMessage.role === "user") {
              const newAssistantMsg = createAssistantMessage(token, []);
              return [...newMessages, newAssistantMsg];
            } 
            
            // 5. Otherwise, append the token to the existing assistant message
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + token,
            };
            
            return newMessages;
          });
        },

        onComplete: async (metadata) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              sources: metadata.sources || [],
            };
            return newMessages;
          });

          setSources(metadata.sources || []);

          if (metadata.chatId && !selectedChat) {
            setSelectedChat({ _id: metadata.chatId });
            await refreshHistory();
          }
        }
      });

    } catch (err) {
      const message = err?.message || "Something went wrong.";

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];

        // If it failed before any tokens arrived, push a new error message
        if (lastMessage.role === "user") {
           return [...newMessages, createAssistantMessage(message)];
        }
        
        // If it failed mid-stream, append the error
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + `\n\n[Error: ${message}]`,
        };
        return newMessages;
      });

      setError(message);
    } finally {
      // Ensure typing indicator is cleared even if it fails immediately
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