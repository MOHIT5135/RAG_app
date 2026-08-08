import {
  Bot,
  FileText,
  RotateCcw,
  PanelLeft,
  Library,
} from "lucide-react";

const ChatHeader = ({
  uploadedDocuments = [],
  onNewChat,
  sidebarOpen,
  setSidebarOpen,
  sourcesOpen,
  setSourcesOpen,
}) => {
  return (
    <header className="flex min-h-18 shrink-0 items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950 px-3 sm:px-4 md:px-6">
      {/* =====================================================
          Left Section
      ====================================================== */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 sm:h-10 sm:w-10">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-white sm:text-lg">
            RAGify AI
          </h1>

          <p className="hidden truncate text-xs text-zinc-400 sm:block">
            Ask questions about your uploaded documents
          </p>
        </div>
      </div>

      {/* =====================================================
          Right Section
      ====================================================== */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

        {/* Documents */}
        <div className="hidden items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 md:flex">
          <FileText className="h-4 w-4 text-violet-400" />

          <span className="text-sm text-zinc-300">
            {uploadedDocuments.length}{" "}
            {uploadedDocuments.length === 1
              ? "Document"
              : "Documents"}
          </span>
        </div>

        {/* Documents - Mobile */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 md:hidden">
          <FileText className="h-4 w-4 text-violet-400" />
        </div>

        {/* Sources Toggle */}
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition sm:flex ${
            sourcesOpen
              ? "border-violet-500 bg-violet-600 text-white"
              : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-violet-500"
          }`}
          aria-label="Toggle sources"
        >
          <Library className="h-4 w-4" />
          <span className="hidden md:inline">Sources</span>
        </button>

        {/* Sources - Mobile */}
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition sm:hidden ${
            sourcesOpen
              ? "border-violet-500 bg-violet-600 text-white"
              : "border-zinc-700 bg-zinc-900 text-zinc-300"
          }`}
          aria-label="Toggle sources"
        >
          <Library className="h-4 w-4" />
        </button>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-500 px-2.5 text-sm text-violet-400 transition hover:bg-violet-600 hover:text-white sm:h-auto sm:px-3 sm:py-2"
          aria-label="New chat"
        >
          <RotateCcw className="h-4 w-4" />

          <span className="hidden xs:inline sm:inline">
            New Chat
          </span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;