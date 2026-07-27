import { getCollection } from "../config/chroma.js";

export const storeVectors = async (chunks, embeddings, fileName, docId) => {
  const collection = await getCollection();

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (let i = 0; i < chunks.length; i++) {
    ids.push(`${docId}-chunk-${i}`);
    documents.push(chunks[i]);
    metadatas.push({ docId, fileName, chunkIndex: i });
  }

  await collection.add({ ids, documents, embeddings, metadatas });
  console.log(`✅ Stored ${chunks.length} chunks in ChromaDB for docId ${docId}`);
};