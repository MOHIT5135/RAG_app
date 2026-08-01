import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { resolveDocIds, resolveTotalChunks, findMatchingDocumentFromQuery } from "./documentLookupService.js";
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

const answerTemplate = PromptTemplate.fromTemplate(
  `You are a helpful assistant answering questions using ONLY the context below.
Each context chunk is labeled with a source number like [1], [2].

Rules:
- Answer using only the given context. If the answer isn't in it, say so clearly.
- Cite the source number(s) inline right after the relevant statement, e.g. "...uses MongoDB [1]."
- Do not invent sources or facts not present in the context.
- Match your tone to the user's original message below — if they express nervousness, confusion, excitement, or urgency, acknowledge it briefly and respond with appropriate warmth, without inventing facts to comfort them.

Context:
{context}

User's original message (for tone only, not for facts): {originalMessage}
Standalone question (for accuracy): {question}

Answer (with inline citations):`
);

// Scales topK based on how many chunks exist in the search scope.
// Capped to avoid blowing up context size, cost, and latency.
const getAdaptiveTopK = (totalChunks) => {
  if (totalChunks <= 10) return 5;
  if (totalChunks <= 30) return 8;
  if (totalChunks <= 60) return 12;
  if (totalChunks <= 150) return 18;
  return 25; // hard cap regardless of how large the document/corpus gets
};
export const answerWithCitations = async (userInput, fileName) => {

  // If frontend didn't specify a document,
  // try to detect one from the user's question.
  let resolvedFileName = fileName;

  if (!resolvedFileName) {
    resolvedFileName =
      await findMatchingDocumentFromQuery(userInput);

    if (resolvedFileName) {
      console.log(
        "📄 Detected document:",
        resolvedFileName
      );
    }
  }
  
  const docIds = await resolveDocIds(fileName); // null = search all, array = scoped
  
  const totalChunks = await resolveTotalChunks(fileName);
  const topK = getAdaptiveTopK(totalChunks);

  // Used ONLY for embedding + retrieval — stays clean and precise
  const standaloneQuestion = await createStandaloneQuestion(userInput);
  const { chunks, distances, metadatas } = await retrieveRelevantChunks(standaloneQuestion, docIds, topK);

  if (chunks.length === 0) {
    return { standaloneQuestion, answer: "I couldn't find relevant information in this document to answer that.", sources: [] };
  }

  const context = chunks.map((chunk, i) => `[${i + 1}] ${chunk}`).join("\n\n");
  const sources = chunks.map((chunk, i) => ({
    number: i + 1,
    text: chunk,
    fileName: metadatas[i]?.fileName,
    chunkIndex: metadatas[i]?.chunkIndex,
    distance: distances[i],
  }));

  // Pass the ORIGINAL user input here too — not just the sanitized standalone question
  const chain = answerTemplate.pipe(getLLM());
  const response = await chain.invoke({
    context,
    question: standaloneQuestion,
    originalMessage: userInput,
  });

  return { standaloneQuestion, answer: response.content, sources, topKUsed : topK };
};