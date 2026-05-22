require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient, SchemaFieldTypes } = require("redis");

const INDEX_NAME = "idx:docs";
const KEY_PREFIX = "doc:";

async function main() {
  const corpus = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "..", "shared-corpus.json"), "utf8")
  );

  const redis = createClient({ url: process.env.REDIS_URL });
  redis.on("error", (err) => console.error("[redis]", err));
  await redis.connect();

  // Drop existing index (safe — keys stay) and recreate.
  try {
    await redis.ft.dropIndex(INDEX_NAME);
    console.log("dropped existing index");
  } catch {}

  await redis.ft.create(
    INDEX_NAME,
    {
      title: { type: SchemaFieldTypes.TEXT, WEIGHT: 5 },
      body: { type: SchemaFieldTypes.TEXT },
      tags: { type: SchemaFieldTypes.TAG, SEPARATOR: "," },
    },
    { ON: "HASH", PREFIX: KEY_PREFIX }
  );
  console.log(`created index ${INDEX_NAME}`);

  for (const doc of corpus) {
    await redis.hSet(KEY_PREFIX + doc.id, {
      title: doc.title,
      body: doc.body,
      tags: doc.tags,
    });
  }
  console.log(`seeded ${corpus.length} documents`);

  await redis.quit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
