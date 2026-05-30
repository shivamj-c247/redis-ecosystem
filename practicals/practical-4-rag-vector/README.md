# Practical 4 — RAG with Vector Search

**Pattern:** Retrieval Augmented Generation over Redis Vector.

1. Embed the user question with Gemini's `gemini-embedding-001` (requesting 768-dim output).
2. KNN search the top-3 documents from `idx:rag`.
3. Stuff them into the Gemini prompt as context, get an answer, return with sources.

## Run

```bash
cp .env.example .env
npm install
npm run seed             # embeds 20 docs (~5 sec, free on Gemini's free tier)
npx serverless offline
```

## Try it

```bash
curl -X POST http://localhost:3000/dev/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"How does Redis help with LLM caching?"}'
```

Response includes the answer **and** a `sources` array showing which documents were retrieved (with similarity scores).

## The code that matters

```js
const queryVec = embed(question);
const result = await redis.ft.search(
  "idx:rag",
  "*=>[KNN 3 @embedding $vec AS score]",
  { PARAMS: { vec: queryVec }, SORTBY: "score", DIALECT: 2 }
);
const context = result.documents.map(d => d.value.body).join("\n\n");
const { text: answer } = await ai.models.generateContent({
  model: "gemini-flash-latest",
  contents: `Context: ${context}\n\nQ: ${question}`,
});
```

## Why Redis for RAG

- Vector store + cache + memory + session — **one system**.
- HNSW index gives sub-millisecond KNN on millions of vectors.
- Pair with Practical 2's semantic cache for cost-effective production RAG.
