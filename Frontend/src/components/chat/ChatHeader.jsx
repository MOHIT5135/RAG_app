import {
  Bot,
  FileText,
  RotateCcw,
  PanelLeft,
  Library,
  Sun,
  Moon,
} from "lucide-react";

import { Link } from "react-router-dom";

const ChatHeader = ({
  uploadedDocuments = [],
  onNewChat,
  sidebarOpen,
  setSidebarOpen,
  sourcesOpen,
  setSourcesOpen,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header
      className={`flex min-h-18 shrink-0 items-center justify-between gap-2 border-b px-3 transition-colors sm:px-4 md:px-6 ${
        darkMode
          ? "border-zinc-800 bg-zinc-950"
          : "border-zinc-200 bg-white"
      }`}
    >
      {/* =====================================================
          Left Section
      ====================================================== */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`shrink-0 rounded-lg p-2 transition ${
            darkMode
              ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 sm:h-10 sm:w-10">
          <Bot className="h-5 w-5 text-violet-500" />
        </div>

        {/* Title */}
        <Link
          to="/"
          className="min-w-0 cursor-pointer"
        >
          <h1
            className={`truncate text-base font-semibold transition-colors sm:text-lg ${
              darkMode
                ? "text-white hover:text-violet-400"
                : "text-zinc-900 hover:text-violet-600"
            }`}
          >
            RAGify AI
          </h1>

          <p
            className={`hidden truncate text-xs sm:block ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Ask questions about your uploaded documents
          </p>
        </Link>
      </div>

      {/* =====================================================
          Right Section
      ====================================================== */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

        {/* ===================================================
            Documents - Desktop
        ==================================================== */}
        <div
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 md:flex ${
            darkMode
              ? "border-zinc-700 bg-zinc-900"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <FileText className="h-4 w-4 text-violet-500" />

          <span
            className={`text-sm ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            {uploadedDocuments.length}{" "}
            {uploadedDocuments.length === 1
              ? "Document"
              : "Documents"}
          </span>
        </div>

        {/* ===================================================
            Documents - Mobile
        ==================================================== */}
        <div
          className={`flex h-9 w-9 items-center justify-center opacity-0 rounded-lg border md:hidden ${
            darkMode
              ? "border-zinc-700 bg-zinc-900"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <FileText className="h-4 w-4 text-violet-500" />
        </div>

        {/* ===================================================
            Sources Toggle - Desktop
        ==================================================== */}
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition sm:flex ${
            sourcesOpen
              ? "border-violet-500 bg-violet-600 text-white"
              : darkMode
                ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-violet-500"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-violet-500"
          }`}
          aria-label="Toggle sources"
        >
          <Library className="h-4 w-4" />

          <span className="hidden md:inline">
            Sources
          </span>
        </button>

        {/* ===================================================
            Sources Toggle - Mobile
        ==================================================== */}
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition sm:hidden ${
            sourcesOpen
              ? "border-violet-500 bg-violet-600 text-white"
              : darkMode
                ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                : "border-zinc-200 bg-white text-zinc-700"
          }`}
          aria-label="Toggle sources"
        >
          <Library className="h-4 w-4" />
        </button>

        {/* ===================================================
            Theme Toggle
        ==================================================== */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition sm:h-10 sm:w-10 ${
            darkMode
              ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
          }`}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* ===================================================
            New Chat
        ==================================================== */}
        <button
          onClick={onNewChat}
          className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-500 px-2.5 text-sm text-violet-500 transition hover:bg-violet-600 hover:text-white sm:h-auto sm:px-3 sm:py-2"
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