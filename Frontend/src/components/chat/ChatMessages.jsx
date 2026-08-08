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
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-y-auto
        px-3
        py-4
        sm:px-6
        sm:py-6
      "
    >

      {messages.length === 0 ? (

        /* =====================================================
           Welcome Screen
        ====================================================== */

        <div className="flex min-h-full flex-1 items-center justify-center">

          <ChatWelcome />

        </div>

      ) : (

        /* =====================================================
           Messages
        ====================================================== */

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