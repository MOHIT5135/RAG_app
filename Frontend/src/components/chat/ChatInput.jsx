import { useState } from "react";
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

    <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4">

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-6xl items-center gap-3 rounded-3xl border border-zinc-700 bg-zinc-900 px-5 py-1 transition focus-within:border-violet-500"
      >

        {/* Upload */}

        <button
          type="button"
          onClick={onUploadClick}
          className="
            flex
            h-10
            w-10
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isTyping}
          placeholder={chatConfig.placeholder}
          className="
            min-h-[24px]
            max-h-36
            flex-1
            resize-none
            bg-transparent
            text-[15px]
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
            h-9
            w-9
            items-center
            justify-center
            rounded-2xl
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

      <p className="mt-1 text-center text-xs text-zinc-500">

        📎 Upload documents • Press <span className="font-medium">Enter</span> to send • <span className="font-medium">Shift + Enter</span> for a new line

      </p>

    </div>

  );

};

export default ChatInput;