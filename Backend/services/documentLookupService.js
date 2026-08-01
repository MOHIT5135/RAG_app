import Document from "../models/Document.js";

/**
 * Resolve a fileName into one or more docIds.
 * - If fileName is omitted or "all", returns null (meaning: search everything).
 * - If fileName matches multiple uploads (same name uploaded twice), returns all matching docIds.
 */
export const resolveDocIds = async (fileName) => {
  if (!fileName || fileName.toLowerCase() === "all") {
    return null;
  }

  const matches = await Document.find({ fileName });

  if (matches.length === 0) {
    throw new Error(
      `No uploaded document found with name "${fileName}".`
    );
  }

  return matches.map((doc) => doc.docId);
};


/**
 * Resolve total chunks.
 */
export const resolveTotalChunks = async (fileName) => {
  if (!fileName || fileName.toLowerCase() === "all") {
    const allDocs = await Document.find();

    return allDocs.reduce(
      (sum, doc) => sum + doc.totalChunks,
      0
    );
  }

  const matches = await Document.find({ fileName });

  return matches.reduce(
    (sum, doc) => sum + doc.totalChunks,
    0
  );
};