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
 * Automatically detect a document mentioned in the user's question.
 *
 * Example:
 * Documents:
 *  Resume.pdf
 *  Hritik_Biodata.pdf
 *
 * User:
 *  "What is the phone number in Hritik_Biodata?"
 *
 * Returns:
 *  "Hritik_Biodata.pdf"
 */
export const findMatchingDocumentFromQuery = async (query) => {
  if (!query) return null;

  const documents = await Document.find();

  const normalizedQuery = query.toLowerCase();

  for (const document of documents) {
    const fileNameWithoutExtension = document.fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase();

    if (normalizedQuery.includes(fileNameWithoutExtension)) {
      return document.fileName;
    }
  }

  return null;
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