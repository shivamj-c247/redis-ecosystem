const { GoogleGenAI } = require("@google/genai");
const { getRedis, floatsToBuffer } = require("./lib/redis");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CHAT_MODEL = "gemini-flash-latest";
const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIM = 768;
const INDEX_NAME = "idx:rag";
const TOP_K = 3;

function ok(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function bad(message, code = 400) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}

module.exports.ask = async (event) => {
  const started = Date.now();
  let question;
  try {
    question = JSON.parse(event.body || "{}").question;
  } catch {
    return bad("invalid JSON body");
  }
  if (!question) return bad("body must be { question: string }");

  const redis = await getRedis();

  const embeddingRes = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: question,
    config: { outputDimensionality: EMBED_DIM },
  });
  const queryVec = floatsToBuffer(embeddingRes.embeddings[0].values);

  let result;
  try {
    result = await redis.ft.search(
      INDEX_NAME,
      `*=>[KNN ${TOP_K} @embedding $vec AS score]`,
      {
        PARAMS: { vec: queryVec },
        SORTBY: "score",
        DIALECT: 2,
        RETURN: ["score", "title", "body"],
      }
    );
  } catch (err) {
    if (String(err.message).includes("Unknown index name")) {
      return bad("Index not found. Run `npm run seed` first.", 404);
    }
    throw err;
  }

  const sources = result.documents.map((d) => ({
    id: d.id.replace(/^rag:doc:/, ""),
    title: d.value.title,
    score: parseFloat(d.value.score),
  }));

  const context = result.documents
    .map((d, i) => `[${i + 1}] ${d.value.title}\n${d.value.body}`)
    .join("\n\n");

  const completion = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: `Context:\n${context}\n\nQuestion: ${question}`,
    config: {
      systemInstruction:
        "Answer using ONLY the provided context. If the context is insufficient, say so. Cite sources by their [number].",
    },
  });

  return ok({
    answer: completion.text,
    sources,
    ms: Date.now() - started,
  });
};
