import formatTime from "./formatTime";

export const createUserMessage = (content) => {
  return {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: formatTime(),
  };
};

export const createAssistantMessage = (content, sources = []) => {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    sources,
    timestamp: formatTime(),
  };
};