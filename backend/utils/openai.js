// backend/utils/openai.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ===============================
   EMBEDDING
================================ */
export const getEmbedding = async (text) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return embedding.data[0].embedding;
};

/* ===============================
   CHAT WITH CONTEXT (FIXED)
================================ */
export const askOpenAIWithContext = async (question, contextText) => {
  const systemPrompt = `
You are a helpful assistant.
Use ONLY the context below to answer the question.

If the answer is not found inside the context,
say: "I don't have this information in the website data."

Context:
${contextText}
`;

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.output_text;
};
