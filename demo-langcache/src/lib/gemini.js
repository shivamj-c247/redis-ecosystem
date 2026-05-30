// Thin Gemini wrapper.
//
// We only need text generation here — LangCache handles embeddings server-side,
// so there's no embedContent call on this path.

import { GoogleGenAI } from "@google/genai";
import { config } from "../config.js";

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

/**
 * Ask Gemini a single question. Returns the text response and an
 * approximate token count (when the model reports it).
 *
 * @param {string} prompt
 * @returns {Promise<{text: string, tokensIn: number, tokensOut: number}>}
 */
export async function ask(prompt) {
  const r = await ai.models.generateContent({
    model: config.gemini.chatModel,
    contents: prompt,
  });

  const usage = r.usageMetadata ?? {};
  return {
    text: r.text ?? "",
    tokensIn: usage.promptTokenCount ?? 0,
    tokensOut: usage.candidatesTokenCount ?? 0,
  };
}
