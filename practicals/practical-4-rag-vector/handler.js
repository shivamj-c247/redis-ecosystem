const OpenAI = require("openai");
const { getRedis, floatsToBuffer } = require("./lib/redis");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const queryVec = floatsToBuffer(embeddingRes.data[0].embedding);

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

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Answer using ONLY the provided context. If the context is insufficient, say so. Cite sources by their [number].",
      },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
    ],
  });

  return ok({
    answer: completion.choices[0].message.content,
    sources,
    ms: Date.now() - started,
  });
};
