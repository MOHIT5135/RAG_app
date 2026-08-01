const UploadHeader = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400">
        📄 Document Upload
      </div>

      {/* Heading */}
      <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white leading-tight">
        Upload Your Documents
      </h2>

      {/* Description */}
      <p className="mt-5 text-lg text-zinc-400 leading-8">
        Upload PDFs, Word documents, PowerPoint presentations, and text files.
        Our AI processes your documents, creates embeddings, stores them in
        ChromaDB, and prepares them for intelligent Retrieval-Augmented
        Generation (RAG).
      </p>
    </div>
  );
};

export default UploadHeader;