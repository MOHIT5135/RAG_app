import {
  FileText,
  History,
  User,
  X,
} from "lucide-react";

import UploadedDocuments from "./UploadedDocuments";
import ChatHistory from "./ChatHistory";

import { useAuth } from "@/context/AuthContext";

const ChatSidebar = ({
  uploadedDocuments,
  selectedDocuments,
  setSelectedDocuments,
  isOpen,
  setSidebarOpen,
  darkMode,
}) => {
  const { user } = useAuth();

  return (
    <aside
      className={`
        flex h-full flex-col
        overflow-hidden
        border-r
        transition-all duration-300

        ${
          darkMode
            ? "border-zinc-800 bg-zinc-950"
            : "border-zinc-200 bg-white"
        }

        ${
          isOpen
            ? "w-64 opacity-100"
            : "w-0 opacity-0 border-r-0"
        }
      `}
    >
      {/* =====================================================
          Workspace Header
      ====================================================== */}
      <div
        className={`shrink-0 border-b px-4 py-4 ${
          darkMode
            ? "border-zinc-800"
            : "border-zinc-200"
        }`}
      >
        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">
            <h2
              className={`text-lg font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              Workspace
            </h2>

            <p
              className={`mt-0.5 text-xs ${
                darkMode
                  ? "text-zinc-400"
                  : "text-zinc-500"
              }`}
            >
              Manage your documents
            </p>
          </div>

          {/* Close button - mobile only */}
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition md:hidden ${
                darkMode
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          Scrollable Area
      ====================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto">

        {/* ===================================================
            Documents
        ==================================================== */}
        <div className="px-3 pt-4 sm:px-4">

          <div className="mb-2 flex items-center gap-2">
            <FileText
              className="h-4 w-4 shrink-0 text-violet-500"
            />

            <span
              className={`text-sm font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              Documents
            </span>
          </div>

          <UploadedDocuments
            documents={uploadedDocuments}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            darkMode={darkMode}
          />

        </div>

        {/* ===================================================
            History
        ==================================================== */}
        <div className="px-3 pt-6 sm:px-4">

          <div className="mb-2 flex items-center gap-2">
            <History
              className="h-4 w-4 shrink-0 text-violet-500"
            />

            <span
              className={`text-sm font-semibold ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              History
            </span>
          </div>

          <ChatHistory
            darkMode={darkMode}
          />

        </div>

      </div>

      {/* =====================================================
          User Profile
      ====================================================== */}
      <div
        className={`shrink-0 border-t p-3 sm:p-4 ${
          darkMode
            ? "border-zinc-800"
            : "border-zinc-200"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-xl border p-3 transition ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <User className="h-5 w-5 text-white" />
          </div>

          {/* User Information */}
          <div className="min-w-0">
            <p
              className={`truncate text-sm font-medium ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              {user?.name || "User"}
            </p>

            <p
              className={`truncate text-xs ${
                darkMode
                  ? "text-zinc-400"
                  : "text-zinc-500"
              }`}
            >
              Developer Workspace
            </p>
          </div>

        </div>
      </div>

    </aside>
  );
};

export default ChatSidebar;