import { Bot, User } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  // Remove inline citation markers like [1], [2], [1,2]
  const formattedMessage = isUser
    ? message.content
    : message.content.replace(/\[(\d+(?:,\s*\d+)*)\]/g, "").trim();

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-violet-600"
              : "border border-zinc-700 bg-zinc-900"
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-violet-400" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-violet-600 text-white"
              : "border border-zinc-800 bg-zinc-900 text-zinc-100"
          }`}
        >
          {/* Sender */}
          <p
            className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${
              isUser
                ? "text-violet-100"
                : "text-violet-400"
            }`}
          >
            {isUser ? "You" : "RAGify AI"}
          </p>

          {/* Message */}
          <p className="whitespace-pre-wrap break-words text-[15px] leading-7">
            {formattedMessage}
          </p>

          {/* Time */}
          {message.timestamp && (
            <p
              className={`mt-2 text-right text-[11px] ${
                isUser
                  ? "text-violet-100"
                  : "text-zinc-500"
              }`}
            >
              {message.timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;