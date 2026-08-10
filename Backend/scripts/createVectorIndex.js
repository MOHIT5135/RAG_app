import "dotenv/config";
import mongoose from "mongoose";
import { ensureVectorIndex } from "../config/vectorStore.js";
 
const EMBEDDING_DIMENSIONS = 768;
 
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Atlas — creating vector index...");
  await ensureVectorIndex({ numDimensions: EMBEDDING_DIMENSIONS });
  await mongoose.disconnect();
  console.log("Done.");
}
 
main().catch((err) => {
  console.error("Failed to create vector index:", err);
  process.exit(1);
});