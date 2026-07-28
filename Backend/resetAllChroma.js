// scripts/resetAllChroma.js
import { client } from "./config/chroma.js";

const resetAllCollections = async () => {
  try {
    const collections = await client.listCollections();
    console.log(`Found ${collections.length} collection(s):`, collections.map(c => c.name));

    for (const col of collections) {
      await client.deleteCollection({ name: col.name });
      console.log(`✅ Deleted: ${col.name}`);
    }

    console.log("All collections deleted.");
  } catch (error) {
    console.error("❌ Error deleting collections:", error.message);
  }
};

resetAllCollections();