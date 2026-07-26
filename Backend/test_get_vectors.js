import { getCollection } from "./config/chroma.js";

const collection = await getCollection();

const result = await collection.get();

console.log("====================================");
console.log("Collection: rag_documents");
console.log("====================================");

console.log("\nIDs:");
console.log(result.ids);

console.log("\nDocuments:");
console.log(result.documents);

console.log("\nMetadata:");
console.log(result.metadatas);

console.log("\nTotal Documents:", result.ids.length);