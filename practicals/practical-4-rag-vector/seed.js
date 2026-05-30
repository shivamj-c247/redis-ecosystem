require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient, SchemaFieldTypes, VectorAlgorithms } = require("redis");
const { GoogleGenAI } = require("@google/genai");

const INDEX_NAME = "idx:rag";
const KEY_PREFIX = "rag:doc:";
const EMBED_MODEL = "gemini-embedding-001";
// Request 768-dim vectors via outputDimensionality so the index DIM stays the same.
const DIM = 768;

function floatsToBuffer(arr) {
  const buf = Buffer.alloc(arr.length * 4);
  for (let i = 0; i < arr.length; i++) buf.writeFloatLE(arr[i], i * 4);
  return buf;
}

async function main() {
  const corpus = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "..", "shared-corpus.json"), "utf8")
  );

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const redis = createClient({ url: process.env.REDIS_URL });
  redis.on("error", (err) => console.error("[redis]", err));
  await redis.connect();

  try {
    await redis.ft.dropIndex(INDEX_NAME);
    console.log("dropped existing index");
  } catch {}

  await redis.ft.create(
    INDEX_NAME,
    {
      embedding: {
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.HNSW,
        TYPE: "FLOAT32",
        DIM,
        DISTANCE_METRIC: "COSINE",
      },
      title: { type: SchemaFieldTypes.TEXT },
      body: { type: SchemaFieldTypes.TEXT },
    },
    { ON: "HASH", PREFIX: KEY_PREFIX }
  );
  console.log(`created ${INDEX_NAME}`);

  console.log(`embedding ${corpus.length} documents...`);
  for (const doc of corpus) {
    const r = await ai.models.embedContent({
      model: EMBED_MODEL,
      contents: `${doc.title}\n\n${doc.body}`,
      config: { outputDimensionality: DIM },
    });
    await redis.hSet(KEY_PREFIX + doc.id, {
      title: doc.title,
      body: doc.body,
      embedding: floatsToBuffer(r.embeddings[0].values),
    });
    process.stdout.write(".");
  }
  console.log(`\nseeded ${corpus.length} documents`);

  await redis.quit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
