import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  host: process.env.CHROMA_HOST || "localhost",
  port: Number(process.env.CHROMA_PORT) || 8000,
  ssl: process.env.CHROMA_SSL === "true", // env vars are always strings, so compare explicitly
});

export const getCollection = async () => {
  const collection = await client.getOrCreateCollection({
    name: "rag_documents",
  });

  return collection;
};
export const checkHeartbeat = async () => {
    const heartbeat = await client.heartbeat();
    console.log("✅ Chroma heartbeat:", heartbeat);
    return heartbeat;
};
export default client;