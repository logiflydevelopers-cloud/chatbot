// backend/utils/openai.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getEmbedding = async (text) => {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
};

export const askOpenAIWithContext = async (question, contextText) => {
  const systemPrompt = `
You are a helpful assistant.
Use ONLY the context below to answer the question.

If the answer is not found inside the context,
say: "I don't have this information in the website data."
  
Context:
${contextText}
  `;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    max_tokens: 300,
  });

  return resp.choices[0].message.content.trim();
};
