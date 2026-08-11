import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import TypingIndicator from "./TypingIndicator";

import scrollToBottom from "@/utils/scrollToBottom";

const ChatMessages = ({
  messages = [],
  isTyping = false,
  darkMode = true,
}) => {
  const containerRef = useRef(null);

  // ==========================================================
  // Auto Scroll
  // ==========================================================

  useEffect(() => {
    scrollToBottom(containerRef);
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className={`
        flex
        h-full
        min-h-0
        flex-col
        overflow-y-auto
        px-3
        py-4
        transition-colors
        sm:px-6
        sm:py-6

        ${
          darkMode
            ? "bg-zinc-950"
            : "bg-white"
        }
      `}
    >

      {/* ======================================================
          Welcome Screen
      ======================================================= */}

      {messages.length === 0 ? (
        <div className="flex min-h-full flex-1 items-center justify-center">

          <ChatWelcome
            darkMode={darkMode}
          />

        </div>
      ) : (

        /* ====================================================
           Messages
        ===================================================== */

        <div className="flex flex-col gap-6">

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              darkMode={darkMode}
            />
          ))}

          {isTyping && (
            <TypingIndicator
              darkMode={darkMode}
            />
          )}

        </div>
      )}

    </div>
  );
};

export default ChatMessages;