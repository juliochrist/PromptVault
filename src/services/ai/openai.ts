import type { AIProvider, AIScore } from "./provider";

const SYSTEM_PROMPTS = {
  improve:
    "You are an expert prompt engineer. Improve the following prompt to make it more effective, clear, and specific. Return only the improved prompt text.",
  explain:
    "Explain what the following prompt does, its purpose, and how it works. Be concise.",
  summarise:
    "Summarise the following prompt in 2-3 sentences. Focus on its goal and structure.",
  translate:
    "Translate the following prompt to the specified language. Preserve all formatting and variables ({{variable}} placeholders).",
  score:
    "Analyze the following prompt and return a JSON object with numeric scores (1-10) for: clarity, context, specificity, consistency. Also provide an array of suggestions for improvement. Return ONLY valid JSON with keys: clarity, context, specificity, consistency, suggestions (array of strings).",
  generateBetter:
    "You are an expert prompt engineer. Generate an improved version of the following prompt. Make it more specific, structured, and effective. Return only the improved prompt text.",
};

async function callOpenAI(
  prompt: string,
  system: string,
  language?: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: language ? `${system} Language: ${language}` : system },
    { role: "user", content: prompt },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content ?? "";
}

export const openaiProvider: AIProvider = {
  async improve(prompt: string) {
    return callOpenAI(prompt, SYSTEM_PROMPTS.improve);
  },

  async explain(prompt: string) {
    return callOpenAI(prompt, SYSTEM_PROMPTS.explain);
  },

  async summarise(prompt: string) {
    return callOpenAI(prompt, SYSTEM_PROMPTS.summarise);
  },

  async translate(prompt: string, language: string) {
    return callOpenAI(prompt, SYSTEM_PROMPTS.translate, language);
  },

  async score(prompt: string) {
    const result = await callOpenAI(prompt, SYSTEM_PROMPTS.score);
    try {
      return JSON.parse(result) as AIScore;
    } catch {
      throw new Error("Failed to parse AI score response");
    }
  },

  async generateBetter(prompt: string) {
    return callOpenAI(prompt, SYSTEM_PROMPTS.generateBetter);
  },
};
