import { FileText, History, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UploadedDocuments from "./UploadedDocuments";
import ChatHistory from "./ChatHistory";

const ChatSidebar = ({
  uploadedDocuments,
  isOpen,
}) => {
  const navigate = useNavigate();

  const handleUploadMore = () => {
    navigate("/", {
      state: {
        scrollToUpload: true,
      },
    });
  };

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

      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-4">

        <h2 className="text-base font-semibold text-white">
          Workspace
        </h2>

        <p className="mt-1 text-xs text-zinc-400">
          Manage your documents
        </p>

      </div>

      {/* Uploaded Documents */}
      <div className="border-b border-zinc-800 p-4">

        <div className="mb-3 flex items-center gap-2">

          <FileText className="h-4 w-4 text-violet-400" />

          <h3 className="text-sm font-semibold text-white">
            Documents
          </h3>

        </div>

        <UploadedDocuments
          documents={uploadedDocuments}
        />

      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">

        <div className="mb-3 flex items-center gap-2">

          <History className="h-4 w-4 text-violet-400" />

          <h3 className="text-sm font-semibold text-white">
            History
          </h3>

        </div>

        <ChatHistory history={[]} />

      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">

        <button
          onClick={handleUploadMore}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-violet-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-violet-700
          "
        >
          <Upload className="h-4 w-4" />

          Upload More

        </button>

      </div>

    </aside>
  );
};

export default ChatSidebar;