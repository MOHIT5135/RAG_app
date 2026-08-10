import mongoose from "mongoose";
 
/**
 * ======================================================
 * Chunk schema — replaces the Chroma "rag_documents" collection.
 * One document per chunk, embedding stored inline.
 * ======================================================
 */
const chunkSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    docId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    fileName: { type: String, default: "Document" },
    document: { type: String, required: true }, 
    embedding: { type: [Number], required: true },
    pageNumber: { type: Number, default: null },
    sectionHeader: { type: String, default: null },
    chunkIndex: { type: Number, default: 0 },
  },
  { timestamps: true, _id: false }
);
 
export const Chunk = mongoose.models.Chunk || mongoose.model("Chunk", chunkSchema, "rag_chunks");
 
export const VECTOR_INDEX_NAME = "vector_index";
 
/**
 * ======================================================
 * Delete all embeddings of one document
 * ======================================================
 */
export const deleteDocumentVectors = async (docId) => {
  await Chunk.deleteMany({ docId: String(docId) });
};
 
/**
 * ======================================================
 * Health check — replaces Chroma's checkHeartbeat()
 * ======================================================
 */
export const checkHeartbeat = async () => {
  const result = await mongoose.connection.db.admin().ping();
  console.log("✅ Mongo Atlas heartbeat:", result);
  return result;
};
 
/**
 * ======================================================
 * One-time setup: create the Atlas Vector Search index.
 * Run this once (e.g. `node scripts/createVectorIndex.js`) —
 * not on every server boot. Safe to re-run; Atlas will
 * error harmlessly if the index already exists.
 * ======================================================
 */
export const ensureVectorIndex = async ({ numDimensions = 768 } = {}) => {
  const collection = mongoose.connection.db.collection("rag_chunks");
  try {
    await collection.createSearchIndex({
      name: VECTOR_INDEX_NAME,
      type: "vectorSearch",
      definition: {
        fields: [
          { type: "vector", path: "embedding", numDimensions, similarity: "cosine" },
          { type: "filter", path: "userId" },
          { type: "filter", path: "docId" },
        ],
      },
    });
    console.log(`✅ Created vector index "${VECTOR_INDEX_NAME}"`);
  } catch (err) {
    if (err.codeName === "IndexAlreadyExists" || /already exists/i.test(err.message)) {
      console.log(`ℹ️ Vector index "${VECTOR_INDEX_NAME}" already exists — skipping.`);
    } else {
      throw err;
    }
  }
};