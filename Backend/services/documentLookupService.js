import Document from "../models/Document.js";

/**
 * Resolve a fileName into one or more docIds.
 * - If fileName is omitted or "all", returns null (meaning: search everything).
 * - If fileName matches multiple uploads (same name uploaded twice), returns all matching docIds.
 */
export const resolveDocIds = async (fileName) => {
  if (!fileName || fileName.toLowerCase() === "all") {
    return null; // signal: no filter, search across all documents
  }

  const matches = await Document.find({ fileName });

  if (matches.length === 0) {
    throw new Error(`No uploaded document found with name "${fileName}".`);
  }

  return matches.map((doc) => doc.docId);
};