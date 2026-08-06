import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { retrieveRelevantChunks } from "./reterivalService.js";

let llm = null;

const getLLM = () => {
  if (llm) return llm;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  llm = new ChatGoogleGenerativeAI({ apiKey, model: "gemini-3.5-flash-lite" });
  return llm;
};

const standaloneQuestionTemplate = PromptTemplate.fromTemplate(
  `Rewrite the following user message as a single, clear, standalone question.
Remove filler words, small talk, and irrelevant context. Only output the question, nothing else.

User message: {inputQuery}

Standalone question:`
);

export const createStandaloneQuestion = async (userInput) => {
  const chain = standaloneQuestionTemplate.pipe(getLLM());
  const response = await chain.invoke({ inputQuery: userInput });
  return response.content.trim();
};

const answerTemplate = PromptTemplate.fromTemplate(`
You are RAGify AI, an enterprise document intelligence assistant. Answer the question accurately using ONLY the provided context below.

RETRIEVED CONTEXT:
{context}

QUESTION: {question}
USER STYLE/TONE: {originalMessage}

CITATION INSTRUCTIONS:
1. Do NOT refer to raw chunk numbers or raw technical IDs (e.g., never say "Chunk 47" or "Source #1").
2. Always cite sources inline using professional enterprise citations based on the metadata in the context XML tags:
   - If both page and section are present: "According to [Section Header/Subheading] on page [Page Number], [Fact]..."
   - If only page is present: "According to page [Page Number] of [Document Name], [Fact]..."
   - If only section is present: "According to [Section Header/Subheading] in [Document Name], [Fact]..."
3. Format the final output clearly with professional structure.
4. If the context does not contain sufficient information to answer the question, state explicitly what details are missing under an "Unresolved Queries" section.
`);

// Scales topK based on how many chunks exist in the search scope.
// Capped to avoid blowing up context size, cost, and latency.
const getAdaptiveTopK = (totalChunks) => {
  if (totalChunks <= 10) return 3;   
  if (totalChunks <= 30) return 5;   
  if (totalChunks <= 60) return 8;   
  if (totalChunks <= 150) return 12; 
  return 15;                // hard cap at 15        
};
export const answerWithCitations = async (userInput, documentId, totalChunks, userId) => {
  const docIds = documentId ? [documentId] : null;

  // Fallback in case totalChunks is not provided
  const topK = getAdaptiveTopK(totalChunks || 10);

  // Used ONLY for embedding + retrieval — stays clean and precise
  console.time("create standalone Question");
  const standaloneQuestion = await createStandaloneQuestion(userInput);
  console.timeEnd("create standalone Question");

  console.time("retrive chunks");
  const { chunks, distances, metadatas, sources: retrievalMethods } = await retrieveRelevantChunks(standaloneQuestion, docIds, userId, topK);
  console.timeEnd("retrive chunks");

  if (chunks.length === 0) {
    return { standaloneQuestion, answer: "I couldn't find relevant information in this document to answer that.", sources: [] };
  }

  // Inject structural XML tags into the context passed to Gemini
  const context = chunks
    .map((chunkText, i) => {
      const meta = metadatas[i] || {};
      const docName = meta.fileName || "Document";
      const page = meta.pageNumber ? ` page="${meta.pageNumber}"` : "";
      const section = meta.sectionHeader ? ` section="${meta.sectionHeader}"` : "";

      return `<context_item doc_name="${docName}"${page}${section}>\n${chunkText}\n</context_item>`;
    })
    .join("\n\n");

  const citations = chunks.map((chunk, i) => ({
    number: i + 1,
    text: chunk,
    fileName: metadatas[i]?.fileName,
    pageNumber: metadatas[i]?.pageNumber || null,
    sectionHeader: metadatas[i]?.sectionHeader || null,
    chunkIndex: metadatas[i]?.chunkIndex,
    distance: distances[i],
    retrievalMethod: retrievalMethods[i],
  }));

  // Pass the ORIGINAL user input here too — not just the sanitized standalone question
  const chain = answerTemplate.pipe(getLLM());
  console.time("Answer Generation");
  const response = await chain.invoke({
    context,
    question: standaloneQuestion,
    originalMessage: userInput,
  });
  console.timeEnd("Answer Generation");

  return { standaloneQuestion, answer: response.content, sources: citations, topKUsed : topK};
};