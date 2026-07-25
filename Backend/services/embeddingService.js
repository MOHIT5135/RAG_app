import { GoogleGenAI } from "@google/genai";

/**
 * ============================================================
 * Embedding Service (Gemini -- direct SDK)
 *
 * NOTE: This uses Google's `@google/genai` SDK directly, NOT
 * LangChain's `@langchain/google-genai` wrapper. Why the switch:
 * LangChain's `GoogleGenerativeAIEmbeddings` class is built on
 * an older Google SDK path that silently IGNORES the
 * `outputDimensionality` option -- it always returns the full
 * 3072-dim vector no matter what you pass in, with no error.
 * The direct SDK supports it properly, so we use that here for
 * the embedding step specifically. (LangChain's text splitter
 * is unaffected by this and works fine -- keep using that.)
 *
 * Model facts you should know:
 *  - Model: gemini-embedding-001
 *  - Default output: 3072 dimensions. Truncating to 1536 or 768
 *    via `outputDimensionality` costs very little quality
 *    (Matryoshka Representation Learning).
 *  - Max input: 2048 tokens per text -- your 1000-char chunks
 *    are safely within that.
 *  - Free tier available; paid tier is $0.15 / 1M input tokens.
 *  - Use a different task_type for documents vs. queries:
 *    RETRIEVAL_DOCUMENT -> when embedding chunks to store
 *    RETRIEVAL_QUERY     -> when embedding the user's question
 * ============================================================
 */

const EMBEDDING_MODEL = "gemini-embedding-001";

// 768 is a good default: ~25% of the storage of the full 3072-dim
// vector with only ~0.26% quality loss -- fine for a portfolio-scale
// vector store. Bump to 1536 or 3072 later if you want max quality.
const DEFAULT_DIMENSIONS = 768;

// Gemini's batch embed endpoint accepts a limited number of texts
// per request; chunk large arrays to stay safely under that limit.
const BATCH_SIZE = 100;

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
        const response = await ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: batch,
            config: {
                taskType: "RETRIEVAL_DOCUMENT",
                outputDimensionality: dimensions
            }
        });

        allEmbeddings.push(...response.embeddings.map((e) => e.values));
    }

    return allEmbeddings;
};

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

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: [query],
        config: {
            taskType: "RETRIEVAL_QUERY",
            outputDimensionality: dimensions
        }
    });

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
