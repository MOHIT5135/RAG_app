import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import chatConfig from "../../data/chatConfig";

const ChatInput = ({
  onSend = () => {},
  isTyping = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isTyping) return;

    onSend(trimmedMessage);
    setMessage("");
  };

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
        className="flex items-end gap-3"
      >

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={chatConfig.placeholder}
          disabled={isTyping}
          className="
            min-h-[48px]
            max-h-40
            flex-1
            resize-none
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            py-3
            text-sm
            text-white
            placeholder:text-zinc-500
            outline-none
            transition-all
            duration-200
            focus:border-violet-500
            focus:ring-1
            focus:ring-violet-500
          "
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-violet-600
            text-white
            transition-all
            duration-200
            hover:bg-violet-700
            disabled:cursor-not-allowed
            disabled:bg-zinc-700
          "
        >
          <SendHorizontal className="h-5 w-5" />
        </button>

      </form>

      <p className="mt-2 text-center text-[11px] text-zinc-500">
        Press <span className="font-medium">Enter</span> to send ·{" "}
        <span className="font-medium">Shift + Enter</span> for a new line
      </p>

    </div>
  );
};

export default ChatInput;