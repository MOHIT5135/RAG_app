import {
  FileText,
  History,
  User,
  X,
  LogOut,
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
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside
      className={`
        flex h-full flex-col
        border-r border-zinc-800
        bg-zinc-950
        overflow-hidden
        transition-all duration-300
        ${isOpen
          ? "w-64 opacity-100"
          : "w-0 opacity-0 border-r-0"}
      `}
    >
      {/* =====================================================
          Workspace Header
      ====================================================== */}
      <div className="shrink-0 border-b border-zinc-800 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">
              Workspace
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400">
              Manage your documents
            </p>
          </div>

          {/* Close button - mobile only */}
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
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

        {/* Documents */}
        <div className="px-3 pt-4 sm:px-4">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-violet-400" />

            <span className="text-sm font-semibold text-white">
              Documents
            </span>
          </div>

          <UploadedDocuments
            documents={uploadedDocuments}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
          />
        </div>

        {/* History */}
        <div className="mt-5 px-3 pb-4 sm:px-4">
          <div className="mb-2 flex items-center gap-2">
            <History className="h-4 w-4 shrink-0 text-violet-400" />

            <span className="text-sm font-semibold text-white">
              History
            </span>
          </div>

          <ChatHistory />
        </div>
      </div>

      {/* =====================================================
          Bottom Profile
      ====================================================== */}
      <div className="shrink-0 border-t border-zinc-800 p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
          
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <User className="h-4 w-4 text-white" />
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || "User"}
            </p>

            <p className="truncate text-[11px] text-zinc-500">
              Developer Workspace
            </p>
          </div>
          {/* Logout Button */}
          <button
            onClick={async () => {
              if (logout) {
                try {
                  await logout();
                  window.location.href = "/";
                } catch (error) {
                  console.error("Failed to log out:", error);
                }
              }
            }}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-red-400"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;