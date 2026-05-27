const { GoogleGenAI } = require("@google/genai");
const { getRedis } = require("./lib/redis");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CHAT_MODEL = "gemini-flash-latest";

const PROCESSING_TTL = 60;
const RESPONSE_TTL = 60 * 60 * 24;

function ok(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function err(message, code = 400) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}

module.exports.generate = async (event) => {
  const started = Date.now();

  const headers = event.headers || {};
  const idempotencyKey =
    headers["Idempotency-Key"] || headers["idempotency-key"];
  if (!idempotencyKey) {
    return err("missing required header: Idempotency-Key");
  }

  let prompt;
  try {
    prompt = JSON.parse(event.body || "{}").prompt;
  } catch {
    return err("invalid JSON body");
  }
  if (!prompt) return err("body must be { prompt: string }");

  const redis = await getRedis();
  const key = `idem:${idempotencyKey}`;

  // Atomic claim — only one caller wins.
  const claimed = await redis.set(key, "processing", {
    NX: true,
    EX: PROCESSING_TTL,
  });

  if (claimed === null) {
    // Already exists — either still processing, or has a stored response.
    const existing = await redis.get(key);
    if (existing === "processing") {
      return err("request still in flight — retry shortly", 409);
    }
    try {
      const stored = JSON.parse(existing);
      return ok({
        ...stored,
        replayed: true,
        ms: Date.now() - started,
      });
    } catch {
      return err("corrupted idempotency entry", 500);
    }
  }

  // We own the key — actually do the work.
  const completion = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: prompt,
  });

  const response = {
    answer: completion.text,
    usage: completion.usageMetadata,
  };

  await redis.set(key, JSON.stringify(response), { EX: RESPONSE_TTL });

  return ok({
    ...response,
    replayed: false,
    ms: Date.now() - started,
  });
};
