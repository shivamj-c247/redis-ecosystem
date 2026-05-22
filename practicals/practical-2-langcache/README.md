# Practical 2 — LangCache (Semantic Cache)

**Pattern:** semantic caching of LLM responses using Redis Vector + KNN.

Different wordings of the same question should hit the same cache entry. We embed the question with `text-embedding-3-small`, do a 1-NN search in Redis, and return the cached answer if cosine distance is below a threshold.

## Run

```bash
cp .env.example .env
npm install
npx serverless offline
```

The index is created lazily on first request.

## Try it

```bash
# Cache miss — populates the index
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Redis?"}'

# Rephrased — semantic hit, returns the same answer
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Explain Redis to me"}'
```

## The code that matters

```js
const queryVec = await embed(question);

// 1-NN search by cosine distance
const result = await redis.ft.search(
  "idx:langcache",
  "*=>[KNN 1 @embedding $vec AS score]",
  { PARAMS: { vec: queryVec }, SORTBY: "score", DIALECT: 2 }
);

if (result.documents[0]?.value.score <= 0.15) {
  return result.documents[0].value.answer; // semantic hit
}
```

## Notes

- Threshold tuning matters. `0.15` is a starting point — tighter for legal/medical, looser for casual chat.
- This is a **DIY LangCache**. Redis also offers a managed [LangCache](https://redis.io/langcache/) product that wraps this pattern behind a single REST call. Same pattern, less ops.
