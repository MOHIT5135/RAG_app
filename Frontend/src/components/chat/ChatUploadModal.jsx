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
}) => {

const fileInputRef = useRef(null);
const [selectedFiles, setSelectedFiles] = useState([]);
const [uploading, setUploading] = useState(false);

const { addDocuments } = useDocuments();

if (!isOpen) return null;

const handleBrowse = () => {
fileInputRef.current?.click();
};

const handleClose = () => {

    setSelectedFiles([]);
    onClose();

};

const handleFileChange = (event) => {

    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setSelectedFiles((prev) => {

        const existing = new Set(
        prev.map(file => file.name + file.size)
        );

        const filtered = files.filter(
        file => !existing.has(file.name + file.size)
        );

        return [...prev, ...filtered];

    });

};

const removeFile = (index) => {

    setSelectedFiles(prev =>
        prev.filter((_, i) => i !== index)
    );

};

const handleUpload = async () => {

  if (selectedFiles.length === 0) return;

    try {

            setUploading(true);
            const response = await uploadDocuments(selectedFiles);
            addDocuments(response.documents);
            setSelectedFiles([]);
            onClose();

    } catch (error) {

        console.error(error);

        alert(error.message || "Upload failed.");

  } finally {

    setUploading(false);

  }

};

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      {/* Modal */}

      <div className="w-sm max-w-x1 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

        <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
        />

        {/* =======================================================
                            Header
        ======================================================== */}

        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-0">

          <div>

            <h2 className="text-xl font-semibold text-white">

              Upload Documents

            </h2>

            <p className="mt-1 text-sm text-zinc-400">

              Upload files to chat with your documents.

            </p>

          </div>

          <button
            onClick={handleClose}
            className="
              rounded-lg
              p-2
              text-zinc-400
              transition
              hover:bg-zinc-800
              hover:text-white
            "
          >

            <X className="h-5 w-5" />

          </button>

        </div>

        {/* =======================================================
                        Upload Area
        ======================================================== */}

        <div className="p-2">

          <div
            className="
              flex
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-zinc-700
              bg-zinc-950
              px-8
              py-1
              transition
              hover:border-violet-500
            "
            onClick={handleBrowse}
          >

            <div className="rounded-full bg-violet-600/20 p-0">

              <Upload className="h-1 w-8 text-violet-400" />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">

              Drag & Drop Files

            </h3>

            <p className="mt-2 text-center text-sm text-zinc-400">

              or click here to browse files

            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowse();
              }}
              className="
                mt-3
                rounded-xl
                bg-violet-600
                px-5
                py-3
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

          {/* =======================================================
                          Supported Formats
          ======================================================== */}

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

            <div className="flex items-center gap-3">

              <FileUp className="h-5 w-5 text-violet-400" />

              <h4 className="font-medium text-white">

                Supported Formats

              </h4>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {["PDF", "DOCX", "DOC", "TXT"].map((type) => (

                <span
                  key={type}
                  className="
                    rounded-lg
                    bg-zinc-800
                    px-3
                    py-1.5
                    text-xs
                    text-zinc-300
                  "
                >

                  {type}

                </span>

              ))}

            </div>

            <p className="mt-4 text-xs text-zinc-500">

              Maximum 10 files • Maximum 10 MB per file

            </p>

          </div>

        </div>

        {
            selectedFiles.length > 0 && (

            <div className="px-5 pb-0">

                <h3 className="mb-3 text-sm font-semibold text-white">

                    Selected Files

                </h3>

                <div className="space-y-1 max-h-48 overflow-y-auto">

                    {selectedFiles.map((file, index) => (

                        <div
                            key={`${file.name}-${file.size}`}
                            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                        >

                            <div className="flex items-center gap-3">

                                <FileText className="h-5 w-5 text-violet-400" />

                                <div>

                                    <p className="text-sm text-white">

                                        {file.name}

                                    </p>

                                    <p className="text-xs text-zinc-500">

                                        {(file.size / 1024 / 1024).toFixed(2)} MB

                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => removeFile(index)}
                                className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                            >

                                <Trash2 className="h-4 w-4" />

                            </button>

                        </div>

                    ))}

                </div>

            </div>

            )
        }

        {/* =======================================================
                          Footer
        ======================================================== */}

        <div className="flex justify-end gap-3 border-t border-zinc-800 px-6 py-4">

            <button
                onClick={handleClose}
                disabled={uploading}
                className="
                rounded-xl
                border
                border-zinc-700
                px-5
                py-2.5
                text-sm
                text-zinc-300
                transition
                hover:bg-zinc-800
                disabled:opacity-50
                "
            >

                Cancel

            </button>

            <button
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
                px-6
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-violet-700
                disabled:cursor-not-allowed
                disabled:bg-zinc-700
                "
            >

                {uploading ? (

                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                </>

                ) : (

                <>
                    <Upload className="h-4 w-4" />
                    Upload
                </>

                )}

            </button>

            </div>
      </div>

    </div>

  );

};

export default ChatUploadModal;