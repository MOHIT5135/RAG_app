import { getCollection } from "../config/chroma.js";

/**
 * Store document chunks and embeddings in ChromaDB
 */
export const storeVectors = async (
  chunks,
  embeddings,
  fileName
) => {

  const collection = await getCollection();

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (let i = 0; i < chunks.length; i++) {

    ids.push(`${fileName}-chunk-${i}`);

    documents.push(chunks[i]);

    metadatas.push({
      fileName,
      chunkIndex: i,
    });
  }

  await collection.add({
    ids,
    documents,
    embeddings,
    metadatas,
  });

  console.log(`✅ Stored ${chunks.length} chunks in ChromaDB`);
};