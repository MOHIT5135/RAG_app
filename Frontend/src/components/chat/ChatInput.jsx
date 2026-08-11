import { useState, useEffect, useRef } from "react";
import {
  Paperclip,
  SendHorizontal,
} from "lucide-react";

import chatConfig from "../../data/chatConfig";

const ChatInput = ({
  onSend = () => {},
  isTyping = false,
  onUploadClick = () => {},
  darkMode = true,
}) => {
  const [message, setMessage] = useState("");

  const textareaRef = useRef(null);

  // ==========================================================
  // Auto Resize Textarea
  // ==========================================================

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      144
    )}px`;
  }, [message]);

  // ==========================================================
  // Send Message
  // ==========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || isTyping) return;

    onSend(trimmed);

    setMessage("");
  };

  // ==========================================================
  // Enter Key
  // ==========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  return (
    <div
      className={`
        w-full
        border-t
        px-2.5
        py-2.5
        transition-colors
        duration-300
        sm:px-5
        sm:py-4

        ${
          darkMode
            ? "border-zinc-800 bg-zinc-950"
            : "border-zinc-200 bg-white"
        }
      `}
    >
      {/* =====================================================
          Input Container
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className={`
          flex
          w-full
          items-end
          gap-2
          rounded-3xl
          border
          px-2
          py-2
          transition
          focus-within:border-violet-500
          sm:gap-3
          sm:px-3
          md:px-4

          ${
            darkMode
              ? "border-zinc-700 bg-zinc-900"
              : "border-zinc-200 bg-zinc-50"
          }
        `}
      >

        {/* =================================================
            Upload Button
        ================================================== */}

        <button
          type="button"
          onClick={onUploadClick}
          disabled={isTyping}
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition

            ${
              darkMode
                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900"
            }

            disabled:cursor-not-allowed
            disabled:opacity-50
          `}
          aria-label="Upload documents"
          title="Upload documents"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* =================================================
            Message Textarea
        ================================================== */}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isTyping}
          placeholder={chatConfig.placeholder}
          className={`
            min-h-10
            max-h-36
            min-w-0
            flex-1
            resize-none
            overflow-y-auto
            bg-transparent
            py-2
            text-[15px]
            leading-6
            outline-none

            ${
              darkMode
                ? "text-white placeholder:text-zinc-500"
                : "text-zinc-900 placeholder:text-zinc-400"
            }

            disabled:cursor-not-allowed
            disabled:opacity-60
          `}
        />

        {/* =================================================
            Send Button
        ================================================== */}

        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            text-white
            transition

            ${
              message.trim() && !isTyping
                ? "bg-violet-600 hover:bg-violet-700"
                : darkMode
                  ? "cursor-not-allowed bg-zinc-700"
                  : "cursor-not-allowed bg-zinc-300"
            }
          `}
          aria-label="Send message"
          title="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>

      </form>

      {/* =====================================================
          Keyboard Hint
      ====================================================== */}

      <p
        className={`
          mt-1
          hidden
          text-center
          text-xs
          sm:block

          ${
            darkMode
              ? "text-zinc-500"
              : "text-zinc-400"
          }
        `}
      >
        📎 Upload documents • Press{" "}
        <span className="font-medium">
          Enter
        </span>{" "}
        to send •{" "}
        <span className="font-medium">
          Shift + Enter
        </span>{" "}
        for a new line
      </p>

    </div>
  );
};

export default ChatInput;