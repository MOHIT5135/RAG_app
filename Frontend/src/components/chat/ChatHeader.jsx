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
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-white">
            RAGify AI
          </h1>

          <p className="text-xs text-zinc-400">
            Ask questions about your uploaded documents
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

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

        {/* Sources Toggle */}
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition lg:flex ${
            sourcesOpen
              ? "border-violet-500 bg-violet-600 text-white"
              : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-violet-500"
          }`}
        >
          <Library className="h-4 w-4" />
          Sources
        </button>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 rounded-lg border border-violet-500 px-3 py-2 text-sm text-violet-400 transition hover:bg-violet-600 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          New Chat
        </button>

      </div>

    </header>
  );
};

export default ChatHeader;