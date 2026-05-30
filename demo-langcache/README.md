# demo-langcache

A conference-ready hands-on demo of **Redis LangCache** (managed semantic cache for AI) + **Google Gemini**, wired up as an Express app with a small frontend dashboard.

The point of the demo: **same intent → same cached answer → zero new tokens.**

```
┌──────────────┐  POST /ask  ┌────────────────┐  search  ┌─────────────────┐
│   Browser    │ ──────────► │   Express      │ ───────► │  Redis          │
│   (vanilla)  │             │   server       │          │  LangCache      │
└──────┬───────┘             │                │ ◄─────── │  (managed)      │
       │  JSON               │  • lookup       │ entries  └─────────────────┘
       │  • prompt           │  • on miss →    │
       │  • answer           │     Gemini      │  ┌──────────────────┐
       │  • cacheHit         │  • store entry  │  │ Gemini           │
       │  • latency          │                 │──┤ gemini-flash-... │
       │  • savings          │                 │  └──────────────────┘
       ▼                     └────────────────┘
```

The flow per request:

1. **Lookup** in LangCache via `search({ prompt, similarityThreshold })`.
2. **Hit** → return the cached `response` straight back. ~milliseconds.
3. **Miss** → call Gemini, return the answer, and `set({ prompt, response })` so the *next* similar prompt is a hit.

LangCache handles embeddings, vector index, and similarity search server-side — this app never touches a vector DB directly.

---

## Project structure

```
demo-langcache/
├── README.md                 ← you are here
├── package.json              type: module, Node ≥ 20
├── .env.example              environment variables template
├── .gitignore
├── .dockerignore
├── Dockerfile                multi-stage, non-root, ~80 MB image
├── docker-compose.yml        one-command run
├── src/
│   ├── server.js             Express bootstrap + /ask, /metrics, /health
│   ├── config.js             env loading + fail-fast validation
│   └── lib/
│       ├── langcache.js      @redis-ai/langcache wrapper (lookup, store)
│       ├── gemini.js         @google/genai chat wrapper
│       └── metrics.js        in-memory hit/miss counters
└── public/                   static frontend (no build step)
    ├── index.html
    ├── styles.css            dark theme, glass cards, red accents
    └── app.js                vanilla JS, fetch + dashboard polling
```

---

## Prerequisites

- **Node.js 20+**
- A **Redis LangCache** service on Redis Cloud — see [Redis Cloud → LangCache → New Service](https://app.redislabs.com/)
- A **Google AI Studio** API key (free tier): https://aistudio.google.com/apikey

---

## Configure

Copy and fill in the env file:

```bash
cp .env.example .env
```

| Variable                          | Where to find it                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `LANGCACHE_HOST`                  | Redis Cloud → LangCache → your service → connection details (the bare hostname, no `https://`) |
| `LANGCACHE_CACHE_ID`              | Same screen — the **Cache ID** column / detail                                   |
| `LANGCACHE_API_KEY`               | Same screen — API key starting with `lc1_...`                                    |
| `LANGCACHE_SIMILARITY_THRESHOLD`  | `0.9` is the official default. Raise for stricter matches, lower for more hits. |
| `GEMINI_API_KEY`                  | https://aistudio.google.com/apikey                                               |
| `GEMINI_CHAT_MODEL`               | Default `gemini-flash-latest` — works reliably on the free tier.                 |
| `PORT`                            | Default `3000`.                                                                  |
| `ESTIMATED_COST_PER_LLM_CALL_USD` | Drives the cosmetic "$ saved" dashboard counter only. Default `0.0001`.          |

---

## Install & run (local)

```bash
npm install
npm run start
# open http://localhost:3000
```

For development with auto-restart on file changes:

```bash
npm run dev
```

---

## Run with Docker

```bash
docker compose up --build
# open http://localhost:3000
```

`.env` is mounted by `docker-compose.yml` — same variables, no rebuilds when only env changes.

---

## REST API

### `POST /ask`

Submit a question. Returns the answer, a `cacheHit` flag, latency, and savings estimate.

```bash
curl -sX POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Redis?"}' | jq
```

**Cache miss** (first time):

```json
{
  "cacheHit": false,
  "prompt": "What is Redis?",
  "answer": "Redis is an in-memory data structure store...",
  "tokensIn": 5,
  "tokensOut": 124,
  "latencyMs": 1840,
  "estimatedSavingsUsd": 0,
  "model": "gemini-flash-latest"
}
```

**Cache hit** (same or similar prompt next time):

```json
{
  "cacheHit": true,
  "prompt": "Tell me about Redis cache",
  "answer": "Redis is an in-memory data structure store...",
  "matchedSimilarity": 0.93,
  "entryId": "8f3a...",
  "latencyMs": 38,
  "estimatedSavingsUsd": 0.0001,
  "model": "gemini-flash-latest"
}
```

### `GET /metrics`

Cumulative session counters (in-memory; resets on restart).

```json
{
  "totalRequests": 12,
  "cacheHits": 7,
  "cacheMisses": 5,
  "hitRate": 0.583,
  "msSavedTotal": 11240,
  "usdSavedTotal": 0.0007,
  "recentMissAvgMs": 1820,
  "uptimeSec": 95
}
```

### `GET /health`

Returns `{ "ok": true }`. Used by the Docker healthcheck.

---

## Live demo script (the conference moment)

Run this exactly during the talk — it lands every time.

| Step | Prompt                            | Expected outcome                          | What to say                                                  |
| ---- | --------------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| 1    | `What is Redis?`                  | **CACHE MISS** · ~1.5–2 s                 | "First time — LangCache has nothing, we call Gemini."        |
| 2    | `What is Redis?` (same prompt)    | **CACHE HIT** · ~50 ms · similarity 1.00  | "Exact match — same prompt, same cached entry."              |
| 3    | `Explain Redis in simple terms`   | **CACHE HIT** · ~50 ms · similarity 0.9x  | "Different words, same intent — semantic match, no LLM call."|
| 4    | `Tell me about Redis cache`       | **CACHE HIT** · ~50 ms · similarity 0.9x  | "Still a hit. Embeddings see meaning, not keywords."         |
| 5    | `What is Kafka?`                  | **CACHE MISS** · ~1.5–2 s                 | "New topic → no semantic neighbor → real LLM call."          |

The dashboard up top updates live with hit rate, ms saved, and $ saved.

---

## Tuning the threshold

`LANGCACHE_SIMILARITY_THRESHOLD` is the lever (range `0..1`, higher = stricter):

| Threshold | Behavior                                                                    |
| --------- | --------------------------------------------------------------------------- |
| `0.95`    | Near-paraphrases only. Safe for legal / medical content.                    |
| `0.90`    | **Default.** Same intent matches; very different topics don't.              |
| `0.80`    | Loose — gives high hit rates but you'll occasionally serve the wrong topic. |

Change it in `.env` and restart. No code change required.

---

## How this maps to production

- Drop-in for any AI endpoint that calls an LLM with a user prompt: chatbots, support bots, RAG, agent tool-routing.
- **Pair with a `Cache-Control`-style "no-cache" hint** for queries that *must* be live (e.g. timestamps, news). Just bypass `lookup()` for those.
- Add metadata via `attributes` in `set({ prompt, response, attributes })` to scope caches per tenant / user / model.

The cache layer is intentionally one file (`src/lib/langcache.js`). Swap to a different semantic cache provider — or to a DIY Redis Vector implementation like this repo's `practicals/practical-2-langcache` — without touching anything else.

---

## License

For demo / educational use.
