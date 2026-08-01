import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import UploadHeader from "./UploadHeader";
import UploadDropzone from "./UploadDropzone";
import SelectedFile from "./SelectedFile";
import UploadInfo from "./UploadInfo";
import UploadButton from "./UploadButton";

import { useFileUpload } from "@/hooks/useFileUpload";
import { uploadConfig } from "@/data/uploadConfig";

const UploadSection = () => {
  const {
    selectedFiles,
    uploadedDocuments,
    loading,
    error,
    handleFileSelection,
    removeFile,
    uploadFiles,
  } = useFileUpload();

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    const response = await uploadFiles();

    if (response?.success) {
      console.log("Upload Successful:", response);
    }
  };

  const handleStartChat = () => {
    navigate("/chat", {
      state: {
        uploadedDocuments,
      },
    });
  };

  return (
    <section
      id="upload"
      className="py-10 px-6"
    >
      <div className="mx-auto max-w-7xl space-y-16">

        {/* Header */}
        <UploadHeader />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={uploadConfig.acceptedFileTypes.join(",")}
          className="hidden"
          onChange={(event) =>
            handleFileSelection(event.target.files)
          }
        />

        {/* Upload Dropzone */}
        <UploadDropzone onBrowse={handleBrowse} />

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            {selectedFiles.map((file, index) => (
              <SelectedFile
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}

        {/* Upload Button */}
        <UploadButton
          disabled={selectedFiles.length === 0}
          loading={loading}
          uploadedDocuments={uploadedDocuments}
          onUpload={handleUpload}
          onStartChat={handleStartChat}
        />

        {/* Uploaded Documents */}
        {uploadedDocuments.length > 0 && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8">
            <h2 className="mb-6 text-2xl font-bold text-emerald-400">
              Uploaded Documents
            </h2>

            <div className="space-y-4">
              {uploadedDocuments.map((document) => (
                <div
                  key={document.docId}
                  className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-5"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {document.fileName}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    <span className="font-medium text-white">
                      Document ID:
                    </span>{" "}
                    {document.docId}
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    <span className="font-medium text-white">
                      Total Chunks:
                    </span>{" "}
                    {document.totalChunks}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Information */}
        <UploadInfo />

      </div>
    </section>
  );
};

export default UploadSection;