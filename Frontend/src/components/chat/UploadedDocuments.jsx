import {
  CheckSquare,
  Square,
  Trash2
} from "lucide-react";

import { useState } from "react";

import { deleteDocument } from "@/services/documentService";
import { useDocuments } from "@/context/DocumentContext";

const UploadedDocuments = ({
 documents = [],
  // CHANGED: Accept an array of selected documents
  selectedDocuments = [],
  setSelectedDocuments,
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const { removeDocument } = useDocuments();

  /**
   * ==========================================================
   * Toggle Multi-Select
   * ==========================================================
   */
  const handleToggleDoc = (document) => {
    const isSelected = selectedDocuments.some((d) => d.docId === document.docId);
    
    if (isSelected) {
      // Remove from selection
      setSelectedDocuments((prev) => prev.filter((d) => d.docId !== document.docId));
    } else {
      // Add to selection
      setSelectedDocuments((prev) => [...prev, document]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]); // Deselect all
    } else {
      setSelectedDocuments([...documents]); // Select all
    }
  };
  /**
   * ==========================================================
   * Delete Document
   * ==========================================================
   */

  const handleDelete = async (e, docId) => {

    e.stopPropagation();

    try {

      setDeletingId(docId);

      await deleteDocument(docId);

      removeDocument(docId);

      // Remove the document from the selected array if it is deleted
      setSelectedDocuments((prev) => prev.filter((d) => d.docId !== docId));

    } catch(error) {
      alert(
        error.message ||
        "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };
    return (
    <div className="space-y-2">
      {/* NEW: Select All Header */}
      {documents.length > 0 && (
        <div className="flex items-center justify-between px-1 pb-1 text-xs text-zinc-400">
          <span>{selectedDocuments.length} of {documents.length} Selected</span>
          <button
            onClick={handleSelectAll}
            className="transition hover:text-white"
          >
            {selectedDocuments.length === documents.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      )}

      <div className="space-y-1">
        {documents.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-center text-xs text-zinc-500">
              No documents uploaded
            </p>
          </div>
        ) : (
          documents.map((document) => {
            // CHANGED: Check if document exists in the selected array
            const isSelected = selectedDocuments.some(
              (d) => d.docId === document.docId
            );

            return (
              <div
                key={document.docId}
                onClick={() => handleToggleDoc(document)}
                className={`
                  group
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-left
                  transition-all
                  duration-200

                  ${
                    isSelected
                      ? "border-violet-500 bg-violet-500/10 shadow-md shadow-violet-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-violet-500/50 hover:bg-zinc-800"
                  }
                `}
              >
                {/* Checkbox Icon */}
                <div className="flex shrink-0 items-center justify-center">
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-violet-400" />
                  ) : (
                    <Square className="h-4 w-4 text-zinc-600 group-hover:text-violet-400/50" />
                  )}
                </div>

                {/* File Details */}
                <div className="min-w-0 flex-1 pl-1">
                  <p
                    className="truncate text-sm font-medium leading-5 text-white"
                    title={document.fileName}
                  >
                    {document.fileName}
                  </p>
                  <p className="text-[11px] leading-4 text-zinc-500">
                    {document.totalChunks} chunks
                  </p>
                </div>

                {/* Right Side (Delete) */}
                <div className="flex items-center gap-2 pl-2">
                  <Trash2
                    onClick={(e) => handleDelete(e, document.docId)}
                    className={`
                      h-4
                      w-4
                      cursor-pointer
                      text-red-400
                      transition
                      hover:text-red-500

                      ${
                        deletingId === document.docId
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    `}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UploadedDocuments;