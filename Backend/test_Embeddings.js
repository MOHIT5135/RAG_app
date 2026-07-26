// test-embeddings.js — run with: node test-embeddings.js
import "dotenv/config";
import { embedDocuments, embedQuery } from "./services/embeddingService.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Cosine similarity — measures how "close" two vectors are (1 = identical, 0 = unrelated)
// function cosineSimilarity(a, b) {
//     let dot = 0, normA = 0, normB = 0;
//     for (let i = 0; i < a.length; i++) {
//         dot += a[i] * b[i];
//         normA += a[i] * a[i];
//         normB += b[i] * b[i];
//     }
//     return dot / (Math.sqrt(normA) * Math.sqrt(normB));
// }
// const retrievalTemplate = new PromptTemplate({
//     inputVariables: ["question"],
//     template: "Represent this query for retrieving relevent documents: {question}"
// });
// async function run() {
//     const documents = [
//         "MongoDB is a NoSQL document database that stores data in flexible JSON-like documents.",
//         "React is a frontend JavaScript library used to build interactive user interfaces.",
//         "The chef added fresh basil and garlic to the simmering tomato sauce."
//     ];

//     console.log("Step 1: Embedding documents...");
//     const docVectors = await embedDocuments(documents);

//     console.log(`✅ Got ${docVectors.length} vectors`);
//     console.log(`✅ Dimensions per vector: ${docVectors[0].length}`); // should be 768
//     console.log("Sample values:", docVectors[0].slice(0, 5));

//     console.log("\nStep 2: Embedding a relevant query...");
//     const rawQuery = "What database should I use for storing JSON-like data?";
//     // 1. Format the text using the template
//     const formattedQuery = await retrievalTemplate.format( { question: rawQuery});
//     // Becomes: "Represent this query for retrieving relevvent documents: What database should I use for storing JSON-like data?"
//     const queryVector = await embedQuery(formattedQuery);

//     console.log("\nStep 3: Comparing similarity (query vs each document)...");
//     documents.forEach((doc, i) => {
//         const score = cosineSimilarity(queryVector, docVectors[i]);
//         console.log(`  [${score.toFixed(4)}] ${doc.slice(0, 60)}...`);
//     });
// }

// run().catch(err => console.error("❌ Embedding failed:", err.message));

// 1. Initialize the Gemini LLM (Defaults to 'gemini-2.5-flash')
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, 
  model: "gemini-3.5-flash"
});
const noisyInput = `
    hey uhhhhh wait quick question im working on this project thing and basically can u tell me what database should I use for storing JSON-like data?? oh also my friend said react is good but idk anyway yeah just let me know because my manager needs this done by like 5pm today thx!!!
`
// 2. Define your template structure
const tweetTemplate = 'Generate a standalone question form this description: {inputQuery}, then answer it.';

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// 3. Compose the chain using the .pipe() method
const tweetChain = tweetPrompt.pipe(llm);

// 4. Invoke the chain and print the output
const response = await tweetChain.invoke({ inputQuery: noisyInput });

console.log(response.content);