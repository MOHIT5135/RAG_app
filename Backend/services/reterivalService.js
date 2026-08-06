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

  // 4. Merge candidates & identify hybrid hits
  const merged = new Map();
  for (const c of vectorCandidates) merged.set(c.id, c);

  for (const c of bm25Candidates) {
    if (merged.has(c.id)) {
      merged.get(c.id).bm25Score = c.bm25Score;
      merged.get(c.id).source = "hybrid";
    } else {
      // Pure BM25 hit — keep distance as null or populate via vector lookup
      merged.set(c.id, { ...c, embedding: null, source: "bm25" });
    }
  }

  // 5. Fetch missing embeddings for BM25-only candidates (if any exist)
  const missingIds = [...merged.values()].filter((c) => !c.embedding).map((c) => c.id);
  if (missingIds.length > 0) {
    const fetched = await collection.get({ ids: missingIds, include: ["embeddings"] });
    if (fetched && fetched.ids) {
      fetched.ids.forEach((id, i) => {
        if (merged.has(id) && fetched.embeddings && fetched.embeddings[i]) {
          merged.get(id).embedding = fetched.embeddings[i];
        }
      });
    }
  }

  // 6. STRICT RELEVANCE FILTERING:
  // - If a chunk has a distance score, keep it ONLY if distance <= 0.70
  // - If it's a pure BM25 hit with no distance, drop it unless it also scored in vector space
  const MAX_DISTANCE_THRESHOLD = 0.70;
  console.time("dedupAndMMR");
  const relevantCandidates = [...merged.values()].filter((c) => {
    if (!c.embedding) return false;

    // Reject weak vector matches
    if (c.distance !== null && c.distance > MAX_DISTANCE_THRESHOLD) {
      return false;
    }

    // Reject pure BM25 hits that have no semantic vector match at all
    if (c.source === "bm25" && c.distance == null) {
      return false; 
    }

    return true;
  });

  const deduped = deduplicateCandidates(relevantCandidates);
  const final = mmrRerank(queryEmbedding, deduped, topK);
  console.timeEnd("dedupAndMMR");

  // 7. Return structured results
  return {
    chunks: final.map((r) => r.document),
    distances: final.map((r) => r.distance ?? null),
    metadatas: final.map((r) => r.metadata),
    sources: final.map((r) => r.source),
  };
};