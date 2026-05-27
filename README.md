# Scaling Modern Applications with Redis & Redis for AI

A 50-minute interactive session delivered as a **Next.js keynote website** + **6 runnable Node.js + Serverless practicals**.

```
serverless-tut/
├── presentation/      # The website-as-presentation (Next.js 15, Tailwind, Framer Motion)
└── practicals/        # 6 standalone serverless apps you can clone and run
```

## Quick start

### Run the presentation

```bash
cd presentation
npm install
npm run dev
# open http://localhost:3000
```

Press `P` for presenter mode. Use `→` / `←` to navigate sections.

### Run any practical

Each practical is **self-contained** — clone, install, run. No monorepo.

```bash
cd practicals/practical-1-basic-cache
npm install
cp .env.example .env   # fill REDIS_URL and GEMINI_API_KEY
npx serverless offline
# POST http://localhost:3000/chat
```

## Prerequisites

- Node.js 20+
- A free [Redis Cloud](https://redis.com/try-free/) instance (Redis Stack — RediSearch + Vector enabled)
- A [Google AI Studio API key](https://aistudio.google.com/apikey) (free tier)

## The 6 practicals

| # | Folder | Pattern |
|---|---|---|
| 1 | `practical-1-basic-cache` | Exact-match LLM response caching with `SET ... EX` |
| 2 | `practical-2-langcache` | Semantic cache using Redis Vector + KNN |
| 3 | `practical-3-redisearch` | Full-text search with `FT.SEARCH` + tag filters |
| 4 | `practical-4-rag-vector` | RAG: embed → KNN → LLM with context |
| 5 | `practical-5-idempotency` | Idempotency-Key pattern with `SET NX EX` |
| 6 | `practical-6-chat-memory` | Per-session conversation history via Lists + TTL |

See [practicals/README.md](practicals/README.md) for setup details.
