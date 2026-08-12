import {
  CheckSquare,
  Square,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import { deleteDocument } from "@/services/documentService";
import { useDocuments } from "@/context/DocumentContext";

const UploadedDocuments = ({
  documents = [],
  selectedDocuments = [],
  setSelectedDocuments,
  darkMode = true,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const { removeDocument } = useDocuments();

  // ==========================================================
  // Toggle Multi-Select
  // ==========================================================
  const handleToggleDoc = (document) => {
    const isSelected = selectedDocuments.some(
      (d) => d.docId === document.docId
    );

    if (isSelected) {
      setSelectedDocuments((prev) =>
        prev.filter((d) => d.docId !== document.docId)
      );
    } else {
      setSelectedDocuments((prev) => [...prev, document]);
    }
  };

  // ==========================================================
  // Select / Deselect All
  // ==========================================================
  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments([...documents]);
    }
  };

  // ==========================================================
  // Delete Document
  // ==========================================================
  const handleDelete = async (e, docId) => {
    e.stopPropagation();

    try {
      setDeletingId(docId);

      await deleteDocument(docId);

      removeDocument(docId);

      setSelectedDocuments((prev) =>
        prev.filter((d) => d.docId !== docId)
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">

      {/* =====================================================
          Select All Header
      ====================================================== */}
      {documents.length > 0 && (
        <div
          className={`mb-2 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <span
            className={`min-w-0 truncate text-[11px] ${
              darkMode
                ? "text-zinc-400"
                : "text-zinc-500"
            }`}
          >
            {selectedDocuments.length} of{" "}
            {documents.length} Selected
          </span>

          <button
            type="button"
            onClick={handleSelectAll}
            className={`shrink-0 text-[11px] font-medium transition ${
              darkMode
                ? "text-violet-400 hover:text-violet-300"
                : "text-violet-600 hover:text-violet-700"
            }`}
          >
            {selectedDocuments.length === documents.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
      )}

      {/* =====================================================
          Documents List
      ====================================================== */}
      <div className="space-y-1">

        {/* Empty State */}
        {documents.length === 0 ? (
          <div
            className={`rounded-xl border p-3 ${
              darkMode
                ? "border-zinc-800 bg-zinc-900"
                : "border-zinc-200 bg-zinc-50"
            }`}
          >
            <p
              className={`text-center text-xs ${
                darkMode
                  ? "text-zinc-500"
                  : "text-zinc-400"
              }`}
            >
              No documents uploaded
            </p>
          </div>
        ) : (
          documents.map((document) => {
            const isSelected = selectedDocuments.some(
              (d) => d.docId === document.docId
            );

            const isDeleting =
              deletingId === document.docId;

            return (
              <div
                key={document.docId}
                onClick={() => {
                  if (!isDeleting) {
                    handleToggleDoc(document);
                  }
                }}
                className={`
                  group
                  flex
                  w-full
                  min-w-0
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  border
                  px-2.5
                  py-2
                  text-left
                  transition-all
                  duration-200

                  ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/10 shadow-md shadow-violet-500/10"
                      : darkMode
                        ? "border-zinc-800 bg-zinc-900 hover:border-violet-500/50 hover:bg-zinc-800"
                        : "border-zinc-200 bg-white hover:border-violet-400 hover:bg-zinc-50"
                  }

                  ${
                    isDeleting
                      ? "cursor-wait opacity-60"
                      : ""
                  }
                `}
              >

                {/* =================================================
                    Checkbox
                ================================================== */}
                <div className="flex shrink-0 items-center justify-center">
                  {isSelected ? (
                    <CheckSquare
                      className="h-4 w-4 text-violet-500"
                    />
                  ) : (
                    <Square
                      className={`h-4 w-4 transition ${
                        darkMode
                          ? "text-zinc-600 group-hover:text-violet-400"
                          : "text-zinc-400 group-hover:text-violet-500"
                      }`}
                    />
                  )}
                </div>

                {/* =================================================
                    File Details
                ================================================== */}
                <div className="min-w-0 flex-1 pl-1">

                  <p
                    className={`truncate text-sm font-medium leading-5 ${
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    }`}
                    title={document.fileName}
                  >
                    {document.fileName}
                  </p>

                  <p
                    className={`truncate text-[11px] leading-4 ${
                      darkMode
                        ? "text-zinc-500"
                        : "text-zinc-500"
                    }`}
                  >
                    {document.totalChunks} chunks
                  </p>

                </div>

                {/* =================================================
                    Delete Button
                    Important: fixed touch area for mobile
                ================================================== */}
                <button
                  type="button"
                  onClick={(e) =>
                    handleDelete(e, document.docId)
                  }
                  disabled={isDeleting}
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    transition

                    ${
                      isDeleting
                        ? "cursor-not-allowed opacity-40"
                        : "text-red-400 hover:bg-red-500/10 hover:text-red-500"
                    }
                  `}
                  aria-label={`Delete ${document.fileName}`}
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>
            );
          })
        )}

      </div>
    </div>
  );
};

export default UploadedDocuments;