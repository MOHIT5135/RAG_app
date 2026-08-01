import { FileText, CheckCircle2 } from "lucide-react";

const UploadedDocuments = ({ documents = [] }) => {
  return (
    <div className="space-y-3">

      {documents.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
          <p className="text-sm text-zinc-400">
            No documents uploaded yet.
          </p>
        </div>
      ) : (
        documents.map((document) => (
          <div
            key={document.docId}
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition-all duration-300 hover:border-violet-500"
          >

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-violet-600/20 p-2">
                <FileText className="h-5 w-5 text-violet-400" />
              </div>

              <div className="min-w-0 flex-1">

                <h4
                    className="w-full truncate font-semibold text-white"
                    title={document.fileName}
                    >
                    {document.fileName}
                </h4>

                <p className="mt-1 text-xs text-zinc-400">
                  {document.totalChunks} Chunks
                </p>

              </div>

              <CheckCircle2 className="h-5 w-5 text-green-400" />

            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default UploadedDocuments;