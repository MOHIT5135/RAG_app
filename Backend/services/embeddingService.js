import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";

// 768 is a good default: ~25% of the storage of the full 3072-dim
// vector with only ~0.26% quality loss -- fine for a portfolio-scale
// vector store. Bump to 1536 or 3072 later if you want max quality.
const DEFAULT_DIMENSIONS = 768;

// Gemini's batch embed endpoint accepts a limited number of texts
// per request; chunk large arrays to stay safely under that limit.
const BATCH_SIZE = 100;

// Retries an embedding call with exponential backoff if rate-limited.
const embedWithRetry = async (fn, maxRetries = 3) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");
      if (isRateLimit && attempt < maxRetries) {
        const waitMs = 20000 * Math.pow(2, attempt); // 20s, 40s, 80s — spans a full RPM window
        console.warn(`Rate limited. Retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
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

    for (const batch of batches) {
        const response = await embedWithRetry(() =>
            ai.models.embedContent({
                model: EMBEDDING_MODEL,
                contents: batch,
                config: { taskType: "RETRIEVAL_DOCUMENT", outputDimensionality: dimensions },
            })
        );
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

    const ai = getClient();
    const dimensions = options.dimensions ?? DEFAULT_DIMENSIONS;

     const response = await embedWithRetry(() =>
        ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: [query],
            config: { taskType: "RETRIEVAL_QUERY", outputDimensionality: dimensions },
        })
    );

    return response.embeddings[0].values;
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
