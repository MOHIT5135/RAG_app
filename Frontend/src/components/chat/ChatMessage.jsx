import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  const formattedMessage = isUser
    ? message.content || ""
    : (message.content || "")
        .replace(/\[(\d+(?:,\s*\d+)*)\]/g, "")
        .trim();

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex w-full max-w-3xl gap-2 sm:gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* =====================================================
            Avatar
        ====================================================== */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
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

        {/* =====================================================
            Message Bubble
        ====================================================== */}
        <div
          className={`min-w-0 max-w-[calc(100%-2.5rem)] rounded-2xl px-3 py-2.5 sm:max-w-[85%] sm:px-4 sm:py-3 md:max-w-3xl ${
            isUser
              ? "bg-violet-600 text-white"
              : "border border-zinc-800 bg-zinc-900 text-zinc-100"
          }`}
        >
          {/* Sender */}
          <p
            className={`mb-1.5 text-[10px] font-semibold uppercase tracking-wide sm:mb-2 sm:text-[11px] ${
              isUser
                ? "text-violet-100"
                : "text-violet-400"
            }`}
          >
            {isUser ? "You" : "RAGify AI"}
          </p>

          {/* Message */}
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px] sm:leading-7">
              {formattedMessage}
            </p>
          ) : (
            <div className="prose prose-invert max-w-none text-[15px] leading-7">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formattedMessage}
              </ReactMarkdown>
            </div>
          )}

          {/* Timestamp */}
          {message.timestamp && (
            <p
              className={`mt-1.5 text-right text-[10px] sm:mt-2 sm:text-[11px] ${
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