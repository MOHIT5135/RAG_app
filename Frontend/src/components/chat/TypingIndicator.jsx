import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-4xl gap-4">

        {/* AI Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>

        {/* Typing Bubble */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-400">
            RAGify AI
          </p>

          <div className="flex items-center gap-2">

            <span className="text-sm text-zinc-400">
              Thinking
            </span>

            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400"></span>

              <span
                className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                style={{ animationDelay: "0.15s" }}
              ></span>

              <span
                className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TypingIndicator;