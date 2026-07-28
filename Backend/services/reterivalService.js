import { getCollection } from "../config/chroma.js";
import { embedQuery } from "./embeddingService.js";

/**
 * Given a user's question, embed it and search ChromaDB for the
 * most relevant chunks — scoped to a specific uploaded document.
 *
 * @param {string} userQuery
 * @param {string[]|null} docIds - array of docIds to scope search to, or null for "search all"
 * @param {number} topK - how many chunks to retrieve
 */
export const retrieveRelevantChunks = async (userQuery, docIds, topK = 5) => {
  if (!userQuery || typeof userQuery !== "string") {
    throw new Error("retrieveRelevantChunks: `userQuery` must be a non-empty string.");
  }

  const queryEmbedding = await embedQuery(userQuery);
  const collection = await getCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where:docIds && docIds.length > 0 ? { docId: { "$in": docIds } } : undefined, 
    // { docId: { "$in": docIds } } works for both single-file search (array of length 1) and
    // "all files" (skip the where clause entirely) — one code path handles both cases.
  });

  return {
    chunks: results.documents[0] || [],
    distances: results.distances[0] || [],
    metadatas: results.metadatas[0] || [],
  };
};