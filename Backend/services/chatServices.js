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

  llm = new ChatGoogleGenerativeAI({ apiKey, model: "gemini-3.5-flash" });
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

Context:
{context}

Question: {question}

Answer (with inline citations):`
);

export const answerWithCitations = async (userInput, docId, topK = 5) => {
  const standaloneQuestion = await createStandaloneQuestion(userInput);
  const { chunks, distances, metadatas } = await retrieveRelevantChunks(standaloneQuestion, docId, topK);

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

  const chain = answerTemplate.pipe(getLLM());
  const response = await chain.invoke({ context, question: standaloneQuestion });

  return { standaloneQuestion, answer: response.content, sources };
};