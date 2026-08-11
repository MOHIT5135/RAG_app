import { useEffect, useState } from "react";

import ChatSection from "../components/chat/ChatSection";
import useChat from "../hooks/useChat";
import { useDocuments } from "@/context/DocumentContext";

const ChatPage = () => {
  const { documents, loading } = useDocuments();

  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("ragify-theme") !== "light";
  });

  useEffect(() => {
    localStorage.setItem(
      "ragify-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const {
    messages,
    sources,
    isTyping,
    sendMessage,
    clearChat,
  } = useChat(selectedDocuments);

  if (loading) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          darkMode
            ? "bg-zinc-950 text-white"
            : "bg-zinc-50 text-zinc-900"
        }`}
      >
        <p className={darkMode ? "text-zinc-400" : "text-zinc-600"}>
          Loading your documents...
        </p>
      </div>
    );
  }

  return (
    <ChatSection
      uploadedDocuments={documents}
      selectedDocuments={selectedDocuments}
      setSelectedDocuments={setSelectedDocuments}
      messages={messages}
      sources={sources}
      isTyping={isTyping}
      onSend={sendMessage}
      onNewChat={clearChat}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
};

export default ChatPage;