import { useState } from "react";
import ChatSection from "../components/chat/ChatSection";
import useChat from "../hooks/useChat";

import { useDocuments } from "@/context/DocumentContext";

const ChatPage = () => {

  const {
    documents,
    loading,
  } = useDocuments();

  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const {
    messages,
    sources,
    isTyping,
    sendMessage,
    clearChat,
  } = useChat(selectedDocuments);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">
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
      // error={error}
      onSend={sendMessage}
      onNewChat={clearChat}
    />
  );
};

export default ChatPage;