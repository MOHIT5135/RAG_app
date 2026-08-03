import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { resolveDocIds, resolveTotalChunks } from "./documentLookupService.js";
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

Format your answer like a professional reference document, not a single paragraph:
- Use short markdown headers (###) to break the answer into logical sections when the question has multiple parts.
- Use **bold labels** for key terms, categories, or sub-points within a section.
- Use bullet points for lists rather than long prose sentences.
- If part of the question cannot be answered from the context, add a final section titled "Missing Information" (use markdown text, use **bold labels**) stating what wasn't covered.
- End with a final section titled "Sources", use markdown text. List every distinct file name cited above, each as a bullet point.

Formatting Rules:
1. Organize the answer into numbered sections whenever there are multiple categories.
2. Use Markdown H2 headings (##) only for the main content sections.
3. Do NOT use Markdown H3 headings (###) anywhere.
4. "Missing Information" and "Sources" must be plain text titles without # symbols.
5. Use bullet lists for items.
6. If a bullet contains multiple related items, use nested bullets.
7. Highlight labels such as Phone Number, Email Address, and Current Location in bold.
8. Never return plain paragraphs when structured information is available.

Rules:
- Answer using only the given context. If the answer isn't in it, say so clearly in the Missing Information section.
- Do not invent sources, section numbers, or facts not present in the context.
- Match your tone to the user's original message below for warmth/formality, without treating it as a factual source.

Context:
{context}

User's original message (for tone only, not for facts): {originalMessage}
Standalone question (for accuracy): {question}

Answer (formatted as described above):`
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
  console.time("resole Document");
  const docIds = await resolveDocIds(fileName); // null = search all, array = scoped
  console.timeEnd("resole Document");
  const totalChunks = await resolveTotalChunks(fileName);
  const topK = getAdaptiveTopK(totalChunks);

  // Used ONLY for embedding + retrieval — stays clean and precise
  console.time("create standalone Question");
  const standaloneQuestion = await createStandaloneQuestion(userInput);
  console.timeEnd("create standalone Question");

  console.time("retrive chunks");
  const { chunks, distances, metadatas, sources: retrievalMethods } = await retrieveRelevantChunks(standaloneQuestion, docIds, topK);
  console.timeEnd("retrive chunks");

  if (chunks.length === 0) {
    return { standaloneQuestion, answer: "I couldn't find relevant information in this document to answer that.", sources: [] };
  }

  const context = chunks
    .map((chunk, i) => `[${metadatas[i]?.fileName}]\n${chunk}`)
    .join("\n\n---\n\n");

  const citations = chunks.map((chunk, i) => ({
    number: i + 1,
    text: chunk,
    fileName: metadatas[i]?.fileName,
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