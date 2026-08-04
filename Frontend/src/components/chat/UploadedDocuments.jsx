import {
  FileText,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import { deleteDocument } from "@/services/documentService";
import { useDocuments } from "@/context/DocumentContext";

const UploadedDocuments = ({
  documents = [],
  activeDocument,
  onSelect,
}) => {

  const [deletingId, setDeletingId] = useState(null);

  const { removeDocument } = useDocuments();

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

    <div className="space-y-1">

      {documents.length === 0 ? (

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">

          <p className="text-center text-xs text-zinc-500">

            No documents uploaded

          </p>

        </div>

      ) : (

        documents.map((document) => {

          const isActive =
            activeDocument?.docId === document.docId;

          return (

            <button
              key={document.docId}
              onClick={() => onSelect(document)}
              className={`
                group
                flex
                w-full
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
                  isActive
                    ? "border-violet-500 bg-violet-500/10 shadow-md shadow-violet-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-violet-500 hover:bg-zinc-800"
                }
              `}
            >

              {/* File Icon */}

              <div
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  ${
                    isActive
                      ? "bg-violet-600/30"
                      : "bg-violet-600/15"
                  }
                `}
              >

                <FileText className="h-4 w-4 text-violet-400" />

              </div>

              {/* File Details */}

              <div className="min-w-0 flex-1">

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

              {/* Right Side */}

              <div className="flex items-center gap-2">

                {isActive && (

                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                )}

                <Trash2
                  onClick={(e) =>
                    handleDelete(
                      e,
                      document.docId
                    )
                  }
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

            </button>

          );

        })

      )}

    </div>

  );

};

export default UploadedDocuments;