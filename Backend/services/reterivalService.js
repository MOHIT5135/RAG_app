import { Chunk, VECTOR_INDEX_NAME } from "../config/vectorStore.js";
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

  // 2. secure metadata filter for Chroma DB
  const filterConditions = [{ userId: { $eq: safeUserId } }];
  if (docIds && docIds.length > 0) {
    filterConditions.push({ docId: { $in: docIds } });
  }
  const vectorFilter = filterConditions.length > 1 ? { $and: filterConditions } : filterConditions[0];

  // 3. Run Dense Vector Search & Sparse BM25 Search concurrently in parallel
  console.time("parallelHybridSearch");
  const [vectorResults, bm25Candidates] = await Promise.all([
    Chunk.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: FETCH_POOL_SIZE * 15,
          limit: FETCH_POOL_SIZE,
          filter: vectorFilter,
        },
      },
      {
        $project: {
          _id: 1,
          document: 1,
          embedding: 1,
          docId: 1,
          userId: 1,
          fileName: 1,
          pageNumber: 1,
          sectionHeader: 1,
          chunkIndex: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]),
    bm25Search(userQuery, docIds, safeUserId, FETCH_POOL_SIZE),
  ]);
  console.timeEnd("parallelHybridSearch");

 const vectorCandidates = vectorResults.map((r) => ({
    id: r._id,
    document: r.document,
    metadata: {
      docId: r.docId,
      userId: r.userId,
      fileName: r.fileName,
      pageNumber: r.pageNumber,
      sectionHeader: r.sectionHeader,
      chunkIndex: r.chunkIndex,
    },
    embedding: r.embedding,
    // NOTE: Atlas vectorSearchScore is a SIMILARITY (higher = better), the
    // opposite direction of Chroma's "distance" (lower = better). Converting
    // here so downstream code that expects "distance" semantics still works.
    // Double-check mmrService.js / any UI code that reads `.distance` against
    // this — flip the sign back out if it turns out to expect a raw score.
    distance: 1 - r.score,
    score: r.score,
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