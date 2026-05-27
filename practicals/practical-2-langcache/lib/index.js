const { SchemaFieldTypes, VectorAlgorithms } = require("redis");

const INDEX_NAME = "idx:langcache";
const KEY_PREFIX = "cache:lc:";
// Gemini text-embedding-004 produces 768-dimensional vectors.
const DIM = 768;

async function ensureIndex(redis) {
  try {
    await redis.ft.info(INDEX_NAME);
    return;
  } catch (e) {
    // index doesn't exist — create it
  }
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
      question: { type: SchemaFieldTypes.TEXT },
      answer: { type: SchemaFieldTypes.TEXT },
    },
    { ON: "HASH", PREFIX: KEY_PREFIX }
  );
}

function floatsToBuffer(arr) {
  const buf = Buffer.alloc(arr.length * 4);
  for (let i = 0; i < arr.length; i++) buf.writeFloatLE(arr[i], i * 4);
  return buf;
}

module.exports = { ensureIndex, floatsToBuffer, INDEX_NAME, KEY_PREFIX, DIM };
