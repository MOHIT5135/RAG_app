import { useLocation } from "react-router-dom";

import ChatSection from "../components/chat/ChatSection";
import useChat from "../hooks/useChat";

const ChatPage = () => {
  const { state } = useLocation();

  const uploadedDocuments = state?.uploadedDocuments || [];

  // Temporary: use the first uploaded document.
  // Later we'll support multiple documents.
  const selectedFile =
    uploadedDocuments.length > 0
      ? uploadedDocuments[0].fileName
      : null;

  const {
    messages,
    sources,
    isTyping,
    error,
    sendMessage,
    clearChat,
  } = useChat(selectedFile);

  return (
    <ChatSection
      uploadedDocuments={uploadedDocuments}
      messages={messages}
      sources={sources}
      isTyping={isTyping}
      error={error}
      onSend={sendMessage}
      onNewChat={clearChat}
    />
  );
};

export default ChatPage;