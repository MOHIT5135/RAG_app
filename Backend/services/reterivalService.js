import { getCollection } from "../config/chroma.js";
import { embedQuery } from "./embeddingService.js";
import { bm25Search } from "./bm25Service.js";
import { mmrRerank, deduplicateCandidates } from "./mmrService.js";

const FETCH_POOL_SIZE = 50; // candidate pool size before MMR narrows to topK
/**
 * Given a user's question, embed it and search ChromaDB for the
 * most relevant chunks — scoped to a specific uploaded document.
 *
 * @param {string} userQuery
 * @param {string[]|null} docIds - array of docIds to scope search to, or null for "search all"
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
  console.time("embed query");
  const queryEmbedding = await embedQuery(userQuery);
  console.timeEnd("embed query");
  const collection = await getCollection();

  // --- Dense: vector search, larger pool, embeddings included ---
  const whereConditions = [{ userId: safeUserId }];
  if (docIds && docIds.length > 0) {
    whereConditions.push({ docId: { "$in": docIds } });
    // { docId: { "$in": docIds } } works for both single-file search (array of length 1) and
    // "all files" (skip the where clause entirely) — one code path handles both cases.
  }
  const whereClause = { "$and": whereConditions };

  console.time("vectorSearch");
  const vectorResults = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: FETCH_POOL_SIZE,
    where: whereClause,
    include: ["documents", "metadatas", "distances", "embeddings"],
    
  });
  console.timeEnd("vectorSearch");
  const vectorCandidates = (vectorResults.ids[0] || []).map((id, i) => ({
    id,
    document: vectorResults.documents[0][i],
    metadata: vectorResults.metadatas[0][i],
    embedding: vectorResults.embeddings[0][i],
    distance: vectorResults.distances[0][i],
    source: "vector",
  }));

  // --- Sparse: BM25 keyword search, same scope ---
  console.time("bm25Search");
  const bm25Candidates = await bm25Search(userQuery, docIds, safeUserId, FETCH_POOL_SIZE);
  console.timeEnd("bm25Search");

  // --- Merge, dedupe by chunk id, mark hybrid hits ---
  const merged = new Map();
  for (const c of vectorCandidates) merged.set(c.id, c);
  for (const c of bm25Candidates) {
    if (merged.has(c.id)) {
      merged.get(c.id).bm25Score = c.bm25Score;
      merged.get(c.id).source = "hybrid";
    } else {
      merged.set(c.id, { ...c, embedding: null, source: "bm25" });
    }
  }

  // BM25-only hits need embeddings fetched for MMR to work
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
  // --- MMR re-ranking narrows the merged pool down to a diverse topK ---
  console.time("dedupAndMMR");
  const candidatesWithEmbeddings = [...merged.values()].filter((c) => c.embedding !== null);
  const deduped = deduplicateCandidates(candidatesWithEmbeddings);
  const final = mmrRerank(queryEmbedding, deduped, topK);
  console.timeEnd("dedupAndMMR");
  return {
    chunks: final.map((r) => r.document),
    distances: final.map((r) => r.distance ?? null),
    metadatas: final.map((r) => r.metadata),
    sources: final.map((r) => r.source), // "vector" | "bm25" | "hybrid" — useful for testing
  };
};