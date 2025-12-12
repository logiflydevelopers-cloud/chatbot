import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const teachAgentChat = async (req, res) => {
  try {
    const { question } = req.body;

    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question }
      ]
    });

    return res.json({
      success: true,
      answer: ai.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, answer: "API Error" });
  }
};

export const restartAgentChat = (req, res) => {
  return res.json({ success: true });
};
