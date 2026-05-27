const crypto = require("crypto");
const { GoogleGenAI } = require("@google/genai");
const { getRedis } = require("./lib/redis");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CHAT_MODEL = "gemini-flash-latest";

const TTL_SECONDS = 60 * 60;
const EST_COST_PER_CALL_USD = 0.0001;

function ok(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function bad(message) {
  return {
    statusCode: 400,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}

module.exports.chat = async (event) => {
  const started = Date.now();
  let question;
  try {
    question = JSON.parse(event.body || "{}").question;
  } catch {
    return bad("invalid JSON body");
  }
  if (!question || typeof question !== "string") {
    return bad("body must be { question: string }");
  }

  const redis = await getRedis();
  const key = "cache:exact:" + crypto.createHash("sha256").update(question).digest("hex");

  const cached = await redis.get(key);
  if (cached) {
    return ok({
      cached: true,
      answer: cached,
      ms: Date.now() - started,
      costSavedUsd: EST_COST_PER_CALL_USD,
      key,
    });
  }

  const completion = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: question,
  });
  const answer = completion.text;

  await redis.set(key, answer, { EX: TTL_SECONDS });

  return ok({
    cached: false,
    answer,
    ms: Date.now() - started,
    costSavedUsd: 0,
    key,
  });
};
