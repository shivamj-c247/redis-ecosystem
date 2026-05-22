# Practical 1 — Basic Cache

**Pattern:** exact-match caching of LLM responses with `SET key value EX seconds`.

Hash the question, use that as a Redis key, store the OpenAI answer with a 1-hour TTL. Second request with the **same** question returns from Redis in ~5ms instead of waiting ~800ms for OpenAI.

## Run

```bash
cp .env.example .env   # fill in REDIS_URL and OPENAI_API_KEY
npm install
npx serverless offline
```

## Try it

```bash
# First call — cache miss, hits OpenAI
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Redis?"}'

# Second call — cache hit, blazing fast
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Redis?"}'
```

## The code that matters

```js
const key = "cache:exact:" + sha256(question);
const cached = await redis.get(key);
if (cached) return { cached: true, answer: cached };

const answer = await openai.chat.completions.create({...});
await redis.set(key, answer, { EX: 3600 });
```

## Limitation (motivates Practical 2)

`"What is Redis?"` and `"Tell me about Redis"` produce different hashes — second call is a miss even though the intent is identical. Practical 2 fixes this with **semantic caching**.
