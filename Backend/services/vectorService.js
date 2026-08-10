import { Chunk } from "../config/vectorStore.js";
 
export const storeVectors = async (chunks, embeddings, fileName, docId, userId, metadatas = []) => {
  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("storeVectors: `chunks` must be a non-empty array of strings.");
  }
 
  const docs = chunks.map((chunkText, i) => ({
    _id: `${docId}_chunk_${i}`,
    docId: String(docId),
    userId: String(userId),
    fileName: String(fileName || "Document"),
    document: chunkText,
    embedding: embeddings[i],
    pageNumber: metadatas[i]?.pageNumber ?? null,
    sectionHeader: metadatas[i]?.sectionHeader ?? null,
    chunkIndex: metadatas[i]?.chunkIndex ?? i,
  }));
 
  await Chunk.insertMany(docs, { ordered: false });
 
  console.log(`Successfully stored ${docs.length} vectors in Mongo Atlas for docId: ${docId}`);
};