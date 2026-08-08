import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message }) => {

  const isUser = message.role === "user";

  const formattedMessage = isUser
    ? (message.content || "")
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
          <p
            className={`mb-2 text-[11px] font-semibold uppercase tracking-wide ${
              isUser
                ? "text-violet-100"
                : "text-violet-400"
            }`}
          >
            {isUser ? "You" : "RAGify AI"}
          </p>

          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7">
              {formattedMessage}
            </p>
          ) : (
            <div className="prose prose-invert max-w-none text-[15px] leading-7">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formattedMessage}
              </ReactMarkdown>
            </div>
          )}

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