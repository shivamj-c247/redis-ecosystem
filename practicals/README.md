# Practicals — Redis for AI

Six standalone Node.js + Serverless Framework projects. Each runs locally via `serverless-offline` — no AWS deploy required.

## Setup once

1. **Get a Redis Cloud free instance** at https://redis.com/try-free/. Make sure RediSearch and RedisJSON are enabled (Redis Stack — default on the free tier).
2. **Get a Google AI Studio API key** (free) at https://aistudio.google.com/apikey.
3. Pick a practical, copy `.env.example` to `.env`, fill the values.

```bash
cd practical-1-basic-cache
cp .env.example .env
# edit .env
npm install
npx serverless offline
```

Each practical exposes one HTTP endpoint on `http://localhost:3000`.

## The 6 practicals

| # | Folder | Endpoint | What it shows |
|---|---|---|---|
| 1 | `practical-1-basic-cache` | `POST /chat` | Exact-match LLM caching with `SET ... EX` |
| 2 | `practical-2-langcache` | `POST /chat` | Semantic cache via Redis Vector + KNN |
| 3 | `practical-3-redisearch` | `GET /search` | Full-text + tag search with `FT.SEARCH` |
| 4 | `practical-4-rag-vector` | `POST /ask` | RAG: embed → KNN → LLM with context |
| 5 | `practical-5-idempotency` | `POST /generate` | `SET NX EX` idempotency keys |
| 6 | `practical-6-chat-memory` | `POST /chat` | Per-session history via Lists + TTL |

## Notes

- P3 and P4 need a one-time `npm run seed` to populate Redis from `../../shared-corpus.json`.
- All practicals reuse the same `lib/redis.js` helper — a ~15-line lazy connect that survives Lambda warm starts.
- This is intentionally copy-pasted across folders so each project is self-contained for cloning.
