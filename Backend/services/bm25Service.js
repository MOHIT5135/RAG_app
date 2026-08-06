import { getCollection } from "../config/chroma.js";

// Lowercase, strip punctuation, split on whitespace.
const tokenize = (text) =>
  text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);

const K1 = 1.5;
const B = 0.75;

/**
 * BM25 keyword search over chunks scoped to docIds (or the whole corpus
 * if docIds is null). Fetches the scoped chunk set from Chroma, builds an
 * in-memory BM25 index, and scores every chunk against the query.
 *
 * This is a lightweight, in-memory implementation suited to portfolio/demo
 * scale (hundreds to low thousands of chunks). It rebuilds the index on
 * every call — fine here, but would need a persistent index (e.g.
 * Elasticsearch/OpenSearch) at real production scale.
 */
export const bm25Search = async (query, docIds, userId, topN = 30) => {
  const collection = await getCollection();

  const whereConditions = [];
  if (userId) {
    whereConditions.push({ userId: String(userId) });
  }
  if (docIds && docIds.length > 0) {
    whereConditions.push({ docId: { "$in": docIds } });
  }

  const whereClause = whereConditions.length > 1
    ? { "$and": whereConditions }
    : whereConditions[0] || undefined;
    
  const results = await collection.get({
    where: whereClause,
    include: ["documents", "metadatas"],
  });

  const { ids, documents, metadatas } = results;
  if (!ids || ids.length === 0) return [];

  const tokenizedDocs = documents.map(tokenize);
  const docLengths = tokenizedDocs.map((t) => t.length);
  const avgDocLength = docLengths.reduce((a, b) => a + b, 0) / docLengths.length;

  const df = new Map();
  for (const tokens of tokenizedDocs) {
    for (const term of new Set(tokens)) df.set(term, (df.get(term) || 0) + 1);
  }

  const N = tokenizedDocs.length;
  const idf = (term) => {
    const n = df.get(term) || 0;
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  };

  const queryTerms = tokenize(query);

  const scored = tokenizedDocs.map((tokens, i) => {
    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);

    let score = 0;
    for (const term of queryTerms) {
      const freq = tf.get(term) || 0;
      if (freq === 0) continue;
      const numerator = freq * (K1 + 1);
      const denominator = freq + K1 * (1 - B + B * (docLengths[i] / avgDocLength));
      score += idf(term) * (numerator / denominator);
    }

    return { id: ids[i], document: documents[i], metadata: metadatas[i], bm25Score: score };
  });

  return scored
    .filter((s) => s.bm25Score > 0)
    .sort((a, b) => b.bm25Score - a.bm25Score)
    .slice(0, topN);
};