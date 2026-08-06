import { getCollection } from "../config/chroma.js";

export const storeVectors = async (chunks, embeddings, fileName, docId, userId, metadatas = []) => {
    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
        throw new Error("storeVectors: `chunks` must be a non-empty array of strings.");
  }

  const collection = await getCollection();
    
  const ids = chunks.map((_, i) => `${docId}_chunk_${i}`);

  const metadataPayload = chunks.map((_, i) => ({
       docId: String(docId),
       userId: String(userId),
       fileName: String(fileName || "Document"),
       pageNumber: metadatas[i]?.pageNumber ?? null,
       sectionHeader: metadatas[i]?.sectionHeader ?? null,
       chunkIndex: metadatas[i]?.chunkIndex ?? i
    }));

  await collection.add({ 
    ids, 
    embeddings,
    documents: chunks, 
    metadatas: metadataPayload
  });
  
  console.log(`Successfully stored ${ids.length} vectors in Chroma for docId: ${docId}`);
};