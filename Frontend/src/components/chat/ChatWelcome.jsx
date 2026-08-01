import { Bot, Sparkles, FileSearch } from "lucide-react";

const ChatWelcome = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">

      {/* AI Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/20">
        <Bot className="h-8 w-8 text-violet-400" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-white">
        Welcome to RAGify AI
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
        Ask questions about your uploaded documents and receive
        AI-powered answers with accurate source references.
      </p>

      {/* Feature Cards */}
      <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-2">

        {/* Search Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500">

          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20">
            <FileSearch className="h-5 w-5 text-violet-400" />
          </div>

          <h3 className="text-sm font-semibold text-white">
            Search Documents
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Ask questions about PDFs, DOCX, PPT, TXT and other uploaded files.
          </p>

        </div>

        {/* AI Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500">

          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/20">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>

          <h3 className="text-sm font-semibold text-white">
            AI Powered Answers
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Receive contextual answers generated directly from your uploaded documents.
          </p>

        </div>

      </div>

      {/* Bottom Hint */}
      <p className="mt-8 text-xs text-zinc-500">
        Start by asking a question below 👇
      </p>

    </div>
  );
};

export default ChatWelcome;