import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "http://localhost:8000",
});

export const getCollection = async () => {
  const collection = await client.getOrCreateCollection({
    name: "rag_documents",
  });

  return collection;
};

export default client;