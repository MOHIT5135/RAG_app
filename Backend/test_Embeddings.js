// test-embeddings.js — run with: node test-embeddings.js
import "dotenv/config";
import { embedDocuments, embedQuery } from "./services/embeddingService.js";

// Cosine similarity — measures how "close" two vectors are (1 = identical, 0 = unrelated)
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
    const documents = [
        "MongoDB is a NoSQL document database that stores data in flexible JSON-like documents.",
        "React is a frontend JavaScript library used to build interactive user interfaces.",
        "The chef added fresh basil and garlic to the simmering tomato sauce."
    ];

    console.log("Step 1: Embedding documents...");
    const docVectors = await embedDocuments(documents);

    console.log(`✅ Got ${docVectors.length} vectors`);
    console.log(`✅ Dimensions per vector: ${docVectors[0].length}`); // should be 768
    console.log("Sample values:", docVectors[0].slice(0, 5));

    console.log("\nStep 2: Embedding a relevant query...");
    const query = "What database should I use for storing JSON-like data?";
    const queryVector = await embedQuery(query);

    console.log("\nStep 3: Comparing similarity (query vs each document)...");
    documents.forEach((doc, i) => {
        const score = cosineSimilarity(queryVector, docVectors[i]);
        console.log(`  [${score.toFixed(4)}] ${doc.slice(0, 60)}...`);
    });
}

run().catch(err => console.error("❌ Embedding failed:", err.message));