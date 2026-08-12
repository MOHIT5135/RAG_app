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
}) => {

  const [message, setMessage] = useState("");

  const textareaRef = useRef(null);

  /**
   * ==========================================================
   * Auto Resize Textarea
   * ==========================================================
   */

  useEffect(() => {

    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      144
    )}px`;

  }, [message]);


  /**
   * ==========================================================
   * Send Message
   * ==========================================================
   */

  const handleSubmit = (e) => {

    e.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || isTyping) return;

    onSend(trimmed);

    setMessage("");

  };


  /**
   * ==========================================================
   * Enter Key
   * ==========================================================
   */

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSubmit(e);

    }

  };


  return (

    <div
      className="
        w-full
        border-t
        border-zinc-800
        bg-zinc-950
        px-3
        py-3
        sm:px-5
        sm:py-4
      "
    >

      {/* =====================================================
          Input Container
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="
          flex
          w-full
          items-center
          gap-2
          rounded-3xl
          border
          border-zinc-700
          bg-zinc-900
          px-3
          py-2
          transition
          focus-within:border-violet-500
          sm:gap-3
          sm:px-4
        "
      >

        {/* Upload */}

        <button
          type="button"
          onClick={onUploadClick}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-zinc-800
            text-zinc-400
            transition
            hover:bg-zinc-700
            hover:text-white
          "
        >
          <Paperclip className="h-4 w-4" />
        </button>


        {/* Message */}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isTyping}
          placeholder={chatConfig.placeholder}
          className="
            min-h-10
            max-h-36
            flex-1
            resize-none
            overflow-y-auto
            bg-transparent
            py-2
            text-[15px]
            leading-6
            text-white
            placeholder:text-zinc-500
            outline-none
          "
        />


        {/* Send */}

        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-violet-600
            text-white
            transition
            hover:bg-violet-700
            disabled:cursor-not-allowed
            disabled:bg-zinc-700
          "
        >
          <SendHorizontal className="h-4 w-4" />
        </button>

      </form>


      {/* Hint */}

      <p
        className="
          mt-1
          hidden
          text-center
          text-xs
          text-zinc-500
          sm:block
        "
      >
        📎 Upload documents • Press{" "}
        <span className="font-medium">Enter</span> to send •{" "}
        <span className="font-medium">Shift + Enter</span> for a new line
      </p>

    </div>

  );

};

export default ChatInput;