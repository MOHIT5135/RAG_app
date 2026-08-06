const cosineSimilarity = (a, b) => {
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 0;
  }
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
};

/**
 * Re-ranks a candidate pool with Maximal Marginal Relevance: each pick
 * balances relevance to the query against similarity to chunks already
 * selected, directly countering the duplicate-chunk problem found earlier.
 *
 * lambda -> 1: behaves like plain top-K (pure relevance)
 * lambda -> 0: prioritizes diversity over relevance
 */

// mmrService.js — add this above mmrRerank
const DUPLICATE_THRESHOLD = 0.97; // near-identical embeddings above this are treated as duplicates

export const deduplicateCandidates = (candidates) => {
  const kept = [];
  for (const candidate of candidates) {
    if (!candidate.embedding) continue; 
    const isDuplicate = kept.some(
      (k) => cosineSimilarity(k.embedding, candidate.embedding) >= DUPLICATE_THRESHOLD
    );
    if (!isDuplicate) kept.push(candidate);
  }
  return kept;
};
export const mmrRerank = (queryEmbedding, candidates, topK, lambda = 0.6) => {
  const selected = [];
  const remaining = candidates.filter((c) => c && c.embedding);
  while (selected.length < topK && remaining.length > 0) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = cosineSimilarity(queryEmbedding, candidate.embedding);

      let maxSimToSelected = 0;
      for (const sel of selected) {
        const sim = cosineSimilarity(candidate.embedding, sel.embedding);
        if (sim > maxSimToSelected) maxSimToSelected = sim;
      }

      const mmrScore = lambda * relevance - (1 - lambda) * maxSimToSelected;
      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIdx = i;
      }
    }

    selected.push({ ...remaining[bestIdx], mmrScore: bestScore });
    remaining.splice(bestIdx, 1);
  }

  return selected;
};