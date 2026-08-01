import { Upload, MessageCircle } from "lucide-react";

const UploadButton = ({
  disabled,
  loading,
  uploadedDocuments,
  onUpload,
  onStartChat,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={disabled || loading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload size={22} />

        {loading
          ? "Uploading..."
          : uploadedDocuments.length > 0
          ? "Upload More"
          : "Upload Documents"}
      </button>

      {/* Start Chat Button */}
      {uploadedDocuments.length > 0 && (
        <button
          onClick={onStartChat}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-500 bg-zinc-900 px-8 py-4 text-lg font-semibold text-violet-300 transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20"
        >
          <MessageCircle size={22} />
          Chat with Documents
        </button>
      )}
    </div>
  );
};

export default UploadButton;