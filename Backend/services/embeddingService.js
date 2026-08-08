import { EmbedContentResponse, GoogleGenAI } from "@google/genai";
import { waitForCapacity, recordRequest } from "./rateLimiter.js";
import { LRUCache } from "lru-cache";

const EMBEDDING_MODEL = "gemini-embedding-2";

// 768 is a good default: ~25% of the storage of the full 3072-dim
// vector with only ~0.26% quality loss -- fine for a portfolio-scale
// vector store. Bump to 1536 or 3072 later if you want max quality.
const DEFAULT_DIMENSIONS = 768;

// Gemini's batch embed endpoint accepts a limited number of texts
// per request; chunk large arrays to stay safely under that limit.
const BATCH_SIZE = 40;

// Initialize in-memory cache for query embeddings (Stores up to 500 queries for 2 hours)
const queryEmbeddingCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60 * 2, 
});

// Retries an embedding call with exponential backoff if rate-limited.
/**
 * Extracts the exact retryDelay Gemini's API suggests, if present.
 * Falls back to exponential backoff only when the API doesn't provide one.
 */
const extractRetryDelayMs = (err) => {
  try {
    // The SDK sometimes exposes structured error details directly
    const details = err?.errorDetails || err?.error?.details;
    if (Array.isArray(details)) {
      const retryInfo = details.find((d) => d["@type"]?.includes("RetryInfo"));
      if (retryInfo?.retryDelay) {
        const seconds = parseFloat(retryInfo.retryDelay.replace("s", ""));
        if (!isNaN(seconds)) return Math.ceil(seconds * 1000);
      }
    }

    // Fallback: parse it out of a raw JSON string embedded in err.message
    const match = err?.message?.match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
    if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  } catch {
    // fall through to exponential backoff below
  }
  return null;
};

// Retries an embedding call with exponential backoff if rate-limited.
const embedWithRetry = async (fn, maxRetries = 3) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");
      if (isRateLimit && attempt < maxRetries) {
        const apiSuggestedMs = extractRetryDelayMs(err);
        // Prefer the API's exact suggested wait; only guess if it didn't provide one.
        const waitMs = apiSuggestedMs ?? (5000 * Math.pow(2, attempt));
        const source = apiSuggestedMs ? "API-suggested" : "fallback exponential";

        console.warn(`Rate limited. Waiting ${(waitMs / 1000).toFixed(1)}s (${source}, attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs + 250)); // +250ms safety margin only, not padding
        attempt++;
      } else {
        throw err;
      }
    }
  }
};

let client = null;
const getClient = () => {
    if (client) return client;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing GEMINI_API_KEY environment variable."
        );
    }

    client = new GoogleGenAI({ apiKey });
    return client;
};

const chunkArray = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
};

/**
 * Embed an array of document chunk strings.
 * Use this when storing chunks in your vector DB.
 *
 * @param {string[]} texts
 * @param {object} [options]
 * @param {number} [options.dimensions] - override output dimensionality
 * @returns {Promise<number[][]>} one embedding vector per input text
 */
export const embedDocuments = async (texts, options = {}) => {
    if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error("embedDocuments: `texts` must be a non-empty array of strings.");
    }

    const ai = getClient();
    const dimensions = options.dimensions ?? DEFAULT_DIMENSIONS;
    const batches = chunkArray(texts, BATCH_SIZE);
    const allEmbeddings = [];

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const estimatedTokens = Math.ceil(batch.join(" ").length / 4);

        await waitForCapacity(estimatedTokens);

        console.log(`Sending batch ${i + 1}/${batches.length} (${batch.length} texts, ~${estimatedTokens} tokens)`);

        const response = await embedWithRetry(() =>
            ai.models.embedContent({
                model: EMBEDDING_MODEL,
                // Pass batch array directly in contents
                contents: batch.map(text => ({ parts: [{ text }] })),
                config: { taskType: "RETRIEVAL_DOCUMENT", outputDimensionality: dimensions },
            })
        );

        recordRequest(estimatedTokens);
        console.log(`Received ${response.embeddings.length} embeddings`);
        allEmbeddings.push(...response.embeddings.map((e) => e.values));
    }

    return allEmbeddings;
}
/**
 * Embed a single user query string.
 * Use this at search time, NOT when storing chunks -- the task
 * type is different (RETRIEVAL_QUERY vs RETRIEVAL_DOCUMENT),
 * which is how the model knows to optimize the vector for
 * "find matching documents" rather than "be a document".
 *
 * @param {string} query
 * @param {object} [options]
 * @param {number} [options.dimensions] - override output dimensionality
 * @returns {Promise<number[]>}
 */
export const embedQuery = async (query, options = {}) => {
    if (!query || typeof query !== "string") {
        throw new Error("embedQuery: `query` must be a non-empty string.");
    }

    const dimensions = options.dimensions ?? DEFAULT_DIMENSIONS;
    // Normalize key string to prevent duplicate cache entries for casing/whitespace
    const cacheKey = `${EMBEDDING_MODEL}:${dimensions}:${query.trim().toLowerCase()}`;

    // 1. Return cached embedding if available
    if (queryEmbeddingCache.has(cacheKey)) {
        console.log(`[Cache Hit] Serving cached embedding vector for query: "${query}"`);
        return queryEmbeddingCache.get(cacheKey);
    }
    // 2. Fetch from API on cache miss
    const ai = getClient();
     const response = await embedWithRetry(() =>
        ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: [query],
            config: { taskType: "RETRIEVAL_QUERY", outputDimensionality: dimensions },
        })
    );

    const embeddingVector = response.embeddings[0].values;

    // 3. Save vector to LRU Cache before returning
    queryEmbeddingCache.set(cacheKey, embeddingVector);

    return embeddingVector;
};

/**
 * Convenience helper: embed every chunk produced by chunkFiles()
 * and attach the resulting vector directly onto each chunk object.
 *
 * @param {Array<{ originalName: string, totalChunks: number, chunks: Array }>} chunkedFiles
 * @returns {Promise<Array>} same shape, with `embedding` added to each chunk
 */
export const embedChunkedFiles = async (chunkedFiles) => {
    const results = [];

    for (const file of chunkedFiles) {
        const texts = file.chunks.map((c) => c.text);

        const vectors = await embedDocuments(texts);

        const chunksWithEmbeddings = file.chunks.map((chunk, i) => ({
            ...chunk,
            embedding: vectors[i]
        }));

        results.push({
            ...file,
            chunks: chunksWithEmbeddings
        });
    }

    return results;
};
