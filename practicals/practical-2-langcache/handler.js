const crypto = require("crypto");
const { GoogleGenAI } = require("@google/genai");
const { getRedis } = require("./lib/redis");
const { ensureIndex, floatsToBuffer, KEY_PREFIX, INDEX_NAME } = require("./lib/index");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CHAT_MODEL = "gemini-flash-latest";
const EMBED_MODEL = "text-embedding-004";

// Cosine distance threshold — anything below this is considered a semantic hit.
// Lower = stricter. 0.15 is a reasonable starting point for text-embedding-004.
const SIMILARITY_THRESHOLD = 0.15;

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

async function embed(text) {
  const r = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
  });
  return r.embeddings[0].values;
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
  await ensureIndex(redis);

  const queryEmbedding = await embed(question);
  const queryVector = floatsToBuffer(queryEmbedding);

  const result = await redis.ft.search(
    INDEX_NAME,
    "*=>[KNN 1 @embedding $vec AS score]",
    {
      PARAMS: { vec: queryVector },
      SORTBY: "score",
      DIALECT: 2,
      RETURN: ["score", "question", "answer"],
    }
  );

  if (result.total > 0) {
    const hit = result.documents[0];
    const score = parseFloat(hit.value.score);
    if (score <= SIMILARITY_THRESHOLD) {
      return ok({
        cached: true,
        semantic: true,
        similarity: 1 - score,
        matchedQuestion: hit.value.question,
        answer: hit.value.answer,
        ms: Date.now() - started,
      });
    }
  }

  const completion = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: question,
  });
  const answer = completion.text;

  const id = crypto.randomUUID();
  await redis.hSet(KEY_PREFIX + id, {
    question,
    answer,
    embedding: queryVector,
  });

  return ok({
    cached: false,
    semantic: false,
    answer,
    ms: Date.now() - started,
  });
};
