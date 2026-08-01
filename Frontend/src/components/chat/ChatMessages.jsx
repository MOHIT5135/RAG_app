import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

import scrollToBottom from "@/utils/scrollToBottom";

const ChatMessages = ({
  messages = [],
  isTyping = false,
}) => {

  const containerRef = useRef(null);

  useEffect(() => {
    scrollToBottom(containerRef);
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-y-auto px-6 py-6"
    >

      {messages.length === 0 ? (
        <ChatWelcome />
      ) : (
        <div className="flex flex-col gap-6">

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))}

          {isTyping && <TypingIndicator />}

        </div>
      )}

    </div>
  );
};

export default ChatMessages;