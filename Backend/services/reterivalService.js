import { getCollection } from "../config/chroma.js";
import { embedQuery } from "./embeddingService.js";
import { bm25Search } from "./bm25Service.js";
import { mmrRerank, deduplicateCandidates } from "./mmrService.js";

const FETCH_POOL_SIZE = 50; // Candidate pool size before MMR narrows to topK

/**
 * Given a user's question, embed it and search ChromaDB for the
 * most relevant chunks — scoped to a specific uploaded document and user.
 *
 * @param {string} userQuery
 * @param {string[]|null} docIds - array of docIds to scope search to, or null for "search all"
 * @param {string|number} userId - authenticated user ID
 * @param {number} topK - how many chunks to retrieve
 */
export const retrieveRelevantChunks = async (userQuery, docIds, userId, topK = 5) => {
  if (!userQuery || typeof userQuery !== "string") {
    throw new Error("retrieveRelevantChunks: `userQuery` must be a non-empty string.");
  }
  if (!userId) {
    throw new Error("retrieveRelevantChunks: `userId` is required.");
  }

  const safeUserId = String(userId);

  // 1. Embed query with proper timer logging
  console.time("embed query");
  const queryEmbedding = await embedQuery(userQuery);
  console.timeEnd("embed query");

  const collection = await getCollection();

  // 2. secure metadata filter for Chroma DB
  const whereConditions = [{ userId: safeUserId }];
  if (docIds && docIds.length > 0) {
    whereConditions.push({ docId: { "$in": docIds } });
  }
  const whereClause = whereConditions.length > 1 ? { "$and": whereConditions } : whereConditions[0];

  // 3. Run Dense Vector Search & Sparse BM25 Search concurrently in parallel
  console.time("parallelHybridSearch");
  const [vectorResults, bm25Candidates] = await Promise.all([
    collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: FETCH_POOL_SIZE,
      where: whereClause,
      include: ["documents", "metadatas", "distances", "embeddings"],
    }),
    bm25Search(userQuery, docIds, safeUserId, FETCH_POOL_SIZE)
  ]);
  console.timeEnd("parallelHybridSearch");

  const vectorCandidates = (vectorResults.ids[0] || []).map((id, i) => ({
    id,
    document: vectorResults.documents[0][i],
    metadata: vectorResults.metadatas[0][i],
    embedding: vectorResults.embeddings[0][i],
    distance: vectorResults.distances[0][i],
    source: "vector",
  }));

  // 4. Merge vector and BM25 candidates
  const merged = new Map();
  for (const c of vectorCandidates) merged.set(c.id, c);

  for (const c of bm25Candidates) {
    if (merged.has(c.id)) {
      merged.get(c.id).bm25Score = c.bm25Score;
      merged.get(c.id).source = "hybrid";
    }
  }

  // 5. Filter out candidates without embeddings directly
  console.time("dedupAndMMR");
  const relevantCandidates = [...merged.values()].filter((c) => Boolean(c.embedding));

  const deduped = deduplicateCandidates(relevantCandidates);
  const final = mmrRerank(queryEmbedding, deduped, topK);
  console.timeEnd("dedupAndMMR");

  // 6. Return structured results
  return {
    chunks: final.map((r) => r.document),
    distances: final.map((r) => r.distance ?? null),
    metadatas: final.map((r) => r.metadata),
    sources: final.map((r) => r.source),
  };
};