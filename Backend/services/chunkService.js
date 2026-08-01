import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * ============================================================
 * Text Chunker (LangChain-powered)
 *
 * Wraps LangChain's RecursiveCharacterTextSplitter so the rest
 * of the app can keep using the same chunkText / chunkFiles
 * interface as before -- only the internals changed.
 *
 * RecursiveCharacterTextSplitter tries separators in this order
 * until chunks are small enough: "\n\n" (paragraphs) -> "\n"
 * (lines) -> " " (words) -> "" (characters). This keeps
 * sentences/paragraphs intact wherever possible.
 * ============================================================
 */

const DEFAULT_CHUNK_SIZE = 1200;   // characters per chunk
const DEFAULT_CHUNK_OVERLAP = 150; // characters shared between consecutive chunks

/**
 * Public API: chunkText
 *
 * @param {string} text - Full extracted document text
 * @param {object} options
 * @param {number} options.chunkSize - Target max characters per chunk
 * @param {number} options.chunkOverlap - Characters of overlap between chunks
 * @returns {Promise<Array<{ chunkIndex: number, text: string, charCount: number }>>}
 */
export const chunkText = async (text, options = {}) => {
    const {
        chunkSize = DEFAULT_CHUNK_SIZE,
        chunkOverlap = DEFAULT_CHUNK_OVERLAP
    } = options;

    if (!text || typeof text !== "string") {
        throw new Error("chunkText: `text` must be a non-empty string.");
    }

    // Normalize whitespace a bit (collapse >2 blank lines, trim)
    const cleanedText = text.replace(/\n{3,}/g, "\n\n").trim();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap
    });

    const rawChunks = await splitter.splitText(cleanedText);

    return rawChunks.map((chunkText, index) => ({
        chunkIndex: index,
        text: chunkText,
        charCount: chunkText.length
    }));
};

/**
 * Convenience helper: chunk text for MULTIPLE files at once and
 * attach useful metadata (source filename) to every chunk -- this
 * is the shape you'll want when you generate embeddings next,
 * since each chunk needs to know which document it came from.
 *
 * @param {Array<{ originalName: string, extractedText: string }>} files
 * @param {object} options - same options as chunkText
 */
export const chunkFiles = async (files, options = {}) => {
    const results = [];

    for (const file of files) {
        const chunks = (await chunkText(file.extractedText, options)).map((chunk) => ({
            ...chunk,
            source: file.originalName
        }));

        results.push({
            originalName: file.originalName,
            totalChunks: chunks.length,
            chunks
        });
    }

    return results;
};
