import {
  X,
  Upload,
  FileUp,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";

import { useRef, useState } from "react";

import { uploadDocuments } from "@/services/uploadService";
import { useDocuments } from "@/context/DocumentContext";

const ChatUploadModal = ({
  isOpen,
  onClose,
  darkMode = true,
}) => {
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { addDocuments } = useDocuments();

  if (!isOpen) return null;

  // ==========================================================
  // Browse Files
  // ==========================================================

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // ==========================================================
  // Close Modal
  // ==========================================================

  const handleClose = () => {
    if (uploading) return;

    setSelectedFiles([]);
    onClose();
  };

  // ==========================================================
  // File Selection
  // ==========================================================

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const existing = new Set(
        prev.map(
          (file) => file.name + file.size
        )
      );

      const filtered = files.filter(
        (file) =>
          !existing.has(
            file.name + file.size
          )
      );

      // Maximum 10 files
      const remainingSlots =
        10 - prev.length;

      return [
        ...prev,
        ...filtered.slice(0, remainingSlots),
      ];
    });

    // Allow selecting the same file again later
    event.target.value = "";
  };

  // ==========================================================
  // Remove Selected File
  // ==========================================================

  const removeFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================================
  // Upload Documents
  // ==========================================================

  const handleUpload = async () => {
    if (
      selectedFiles.length === 0 ||
      uploading
    ) {
      return;
    }

    try {
      setUploading(true);

      const response =
        await uploadDocuments(
          selectedFiles
        );

      addDocuments(response.documents);

      setSelectedFiles([]);

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        p-3
        backdrop-blur-sm
        sm:p-5

        ${
          darkMode
            ? "bg-black/70"
            : "bg-black/40"
        }
      `}
    >
      {/* =====================================================
          Modal
      ====================================================== */}

      <div
        className={`
          flex
          max-h-[94vh]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          shadow-2xl
          sm:rounded-3xl

          ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }
        `}
      >

        {/* ===================================================
            Hidden File Input
        ==================================================== */}

        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept=".pdf,.doc,.docx,.txt,.pptx,.xlsx"
          onChange={handleFileChange}
        />

        {/* ===================================================
            Header
        ==================================================== */}

        <div
          className={`
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            border-b
            px-4
            py-4
            sm:px-6
            sm:py-5

            ${
              darkMode
                ? "border-zinc-800"
                : "border-zinc-200"
            }
          `}
        >
          <div className="min-w-0">

            <h2
              className={`
                text-lg
                font-semibold
                sm:text-xl

                ${
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                }
              `}
            >
              Upload Documents
            </h2>

            <p
              className={`
                mt-1
                text-xs
                sm:text-sm

                ${
                  darkMode
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }
              `}
            >
              Upload files to chat with
              your documents.
            </p>

          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
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
                darkMode
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }

              disabled:cursor-not-allowed
              disabled:opacity-50
            `}
            aria-label="Close upload modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ===================================================
            Scrollable Content
        ==================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* =================================================
              Upload Area
          ================================================== */}

          <div className="p-3 sm:p-5">

            <div
              className={`
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                px-4
                py-6
                text-center
                transition
                sm:px-8
                sm:py-8

                ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-950 hover:border-violet-500"
                    : "border-zinc-300 bg-zinc-50 hover:border-violet-500"
                }
              `}
              onClick={handleBrowse}
            >

              {/* Upload Icon */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-600/20
                "
              >
                <Upload className="h-7 w-7 text-violet-500" />
              </div>

              {/* Title */}

              <h3
                className={`
                  mt-4
                  text-base
                  font-semibold
                  sm:text-lg

                  ${
                    darkMode
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                Drag & Drop Files
              </h3>

              {/* Description */}

              <p
                className={`
                  mt-2
                  max-w-xs
                  text-xs
                  sm:text-sm

                  ${
                    darkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                or click here to browse
                files
              </p>

              {/* Browse Button */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowse();
                }}
                className="
                  mt-4
                  rounded-xl
                  bg-violet-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-violet-700
                "
              >
                Browse Files
              </button>

            </div>

            {/* =================================================
                Supported Formats
            ================================================== */}

            <div
              className={`
                mt-4
                rounded-2xl
                border
                p-4
                sm:mt-5
                sm:p-5

                ${
                  darkMode
                    ? "border-zinc-800 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }
              `}
            >

              <div className="flex items-center gap-3">

                <FileUp className="h-5 w-5 shrink-0 text-violet-500" />

                <h4
                  className={`
                    font-medium

                    ${
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    }
                  `}
                >
                  Supported Formats
                </h4>

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "PDF",
                  "DOCX",
                  "DOC",
                  "TXT",
                  "PPTX",
                  "XLSX",
                ].map((type) => (
                  <span
                    key={type}
                    className={`
                      rounded-lg
                      px-2.5
                      py-1.5
                      text-xs

                      ${
                        darkMode
                          ? "bg-zinc-800 text-zinc-300"
                          : "bg-zinc-200 text-zinc-700"
                      }
                    `}
                  >
                    {type}
                  </span>
                ))}

              </div>

              <p
                className={`
                  mt-3
                  text-[11px]
                  sm:text-xs

                  ${
                    darkMode
                      ? "text-zinc-500"
                      : "text-zinc-500"
                  }
                `}
              >
                Maximum 10 files • Maximum
                10 MB per file
              </p>

            </div>

          </div>

          {/* =================================================
              Selected Files
          ================================================== */}

          {selectedFiles.length > 0 && (
            <div className="px-3 pb-4 sm:px-5">

              <div className="mb-3 flex items-center justify-between gap-2">

                <h3
                  className={`
                    text-sm
                    font-semibold

                    ${
                      darkMode
                        ? "text-white"
                        : "text-zinc-900"
                    }
                  `}
                >
                  Selected Files
                </h3>

                <span
                  className={`
                    text-xs

                    ${
                      darkMode
                        ? "text-zinc-500"
                        : "text-zinc-500"
                    }
                  `}
                >
                  {selectedFiles.length}/10
                </span>

              </div>

              <div className="max-h-48 space-y-1.5 overflow-y-auto">

                {selectedFiles.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className={`
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-2
                        rounded-xl
                        border
                        px-3
                        py-2.5
                        sm:px-4
                        sm:py-3

                        ${
                          darkMode
                            ? "border-zinc-800 bg-zinc-950"
                            : "border-zinc-200 bg-zinc-50"
                        }
                      `}
                    >

                      {/* File Details */}

                      <div className="flex min-w-0 flex-1 items-center gap-3">

                        <FileText
                          className="
                            h-5
                            w-5
                            shrink-0
                            text-violet-500
                          "
                        />

                        <div className="min-w-0">

                          <p
                            className={`
                              truncate
                              text-sm

                              ${
                                darkMode
                                  ? "text-white"
                                  : "text-zinc-900"
                              }
                            `}
                            title={file.name}
                          >
                            {file.name}
                          </p>

                          <p
                            className="
                              text-xs
                              text-zinc-500
                            "
                          >
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>

                      </div>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFile(index)
                        }
                        disabled={uploading}
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-red-400
                          transition
                          hover:bg-red-500/10
                          hover:text-red-500
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                        aria-label={`Remove ${file.name}`}
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

        {/* ===================================================
            Footer
        ==================================================== */}

        <div
          className={`
            flex
            shrink-0
            items-center
            justify-end
            gap-2
            border-t
            px-4
            py-3
            sm:gap-3
            sm:px-6
            sm:py-4

            ${
              darkMode
                ? "border-zinc-800"
                : "border-zinc-200"
            }
          `}
        >

          {/* Cancel */}

          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className={`
              rounded-xl
              border
              px-4
              py-2.5
              text-sm
              transition
              sm:px-5

              ${
                darkMode
                  ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }

              disabled:cursor-not-allowed
              disabled:opacity-50
            `}
          >
            Cancel
          </button>

          {/* Upload */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={
              uploading ||
              selectedFiles.length === 0
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-violet-600
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-violet-700
              disabled:cursor-not-allowed
              disabled:bg-zinc-400
              dark:disabled:bg-zinc-700
              sm:px-6
            "
          >

            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </>
            )}

          </button>

        </div>

      </div>
    </div>
  );
};

export default ChatUploadModal;