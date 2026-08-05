import {
  FileText,
  History,
  User,
} from "lucide-react";

import UploadedDocuments from "./UploadedDocuments";
import ChatHistory from "./ChatHistory";

import { useAuth } from "@/context/AuthContext";

const ChatSidebar = ({
  uploadedDocuments,
  activeDocument,
  setActiveDocument,
  isOpen,
}) => {
  const { user } = useAuth();

  return (
    <aside
      className={`
        flex flex-col
        border-r border-zinc-800
        bg-zinc-950
        transition-all duration-300
        overflow-hidden
        ${
          isOpen
            ? "w-64 opacity-100"
            : "w-0 opacity-0 border-r-0"
        }
      `}
    >
      {/* ================= Workspace ================= */}

      <div className="border-b border-zinc-800 px-4 py-4">

        <h2 className="text-lg font-semibold text-white">
          Workspace
        </h2>

        <p className="mt-0.5 text-xs text-zinc-400">
          Manage your documents
        </p>

      </div>

      {/* ================= Scrollable Area ================= */}

      <div className="flex-1 overflow-y-auto">

        {/* Documents */}

        <div className="px-4 pt-4">

          <div className="mb-2 flex items-center gap-2">

            <FileText className="h-4 w-4 text-violet-400" />

            <span className="text-sm font-semibold text-white">

              Documents

            </span>

          </div>

          <UploadedDocuments
            documents={uploadedDocuments}
            activeDocument={activeDocument}
            onSelect={setActiveDocument}
          />

        </div>

        {/* History */}

        <div className="mt-5 px-4 pb-4">

          <div className="mb-2 flex items-center gap-2">

            <History className="h-4 w-4 text-violet-400" />

            <span className="text-sm font-semibold text-white">

              History

            </span>

          </div>

          <ChatHistory/>

        </div>

      </div>

      {/* ================= Bottom ================= */}

      <div className="border-t border-zinc-800 p-4">

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600">

            <User className="h-4 w-4 text-white" />

          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-medium text-white">

              {user?.name || "User"}

            </p>

            <p className="truncate text-[11px] text-zinc-500">

              Developer Workspace

            </p>

          </div>

        </div>

      </div>

    </aside>
  );
};

export default ChatSidebar;