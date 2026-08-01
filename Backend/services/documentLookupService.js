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
 * Try to detect which uploaded document the user is referring to.
 *
 * Works with:
 * Resume
 * resume.pdf
 * Amit Resume
 * Hritik
 * Hritik Biodata
 * Loan Report
 * etc.
 */
export const findMatchingDocumentFromQuery = async (query) => {
  if (!query) return null;

  const documents = await Document.find();

  // Normalize the user's question
  const normalizedQuery = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const document of documents) {

    // Remove extension
    const fileName = document.fileName.replace(/\.[^/.]+$/, "");

    // Normalize filename
    const normalizedFileName = fileName
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = normalizedFileName.split(" ");

    let score = 0;

    // Count how many filename words appear in the query
    for (const word of words) {
      if (word.length < 3) continue;

      if (normalizedQuery.includes(word)) {
        score++;
      }
    }

    // Bonus for full filename match
    if (
      normalizedQuery.includes(normalizedFileName) ||
      normalizedFileName.includes(normalizedQuery)
    ) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = document.fileName;
    }
  }

  // Require at least one meaningful match
  if (bestScore > 0) {
    console.log("Detected Document:", bestMatch);
    return bestMatch;
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