import { getCollection } from "../config/chroma.js";
import { embedQuery } from "./embeddingService.js";

/**
 * Given a user's question, embed it and search ChromaDB for the
 * most relevant chunks — scoped to a specific uploaded document.
 *
 * @param {string} userQuery
 * @param {string} docId - the docId returned when the file was uploaded/stored
 * @param {number} topK - how many chunks to retrieve
 */
export const retrieveRelevantChunks = async (userQuery, docId, topK = 5) => {
  if (!userQuery || typeof userQuery !== "string") {
    throw new Error("retrieveRelevantChunks: `userQuery` must be a non-empty string.");
  }

  const queryEmbedding = await embedQuery(userQuery);
  const collection = await getCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: docId ? { docId } : undefined, // scope search to this document only
  });

  return {
    chunks: results.documents[0] || [],
    distances: results.distances[0] || [],
    metadatas: results.metadatas[0] || [],
  };
};