// Demo backend: Express + LangCache + Gemini.
//
// Flow for POST /ask:
//   1. langcache.lookup(question)         → semantic-cache search
//   2. HIT → return cached response immediately
//      MISS → call Gemini, then langcache.store(question, answer)
//   3. Return latency + estimated savings so the UI can show the wow factor.

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "./config.js";
import { lookup, store } from "./lib/langcache.js";
import { ask } from "./lib/gemini.js";
import { recordHit, recordMiss, snapshot } from "./lib/metrics.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

/* --------------------------------- /ask --------------------------------- */

app.post("/ask", async (req, res) => {
  const t0 = Date.now();
  const question = (req.body?.question ?? "").trim();

  if (!question) {
    return res.status(400).json({ error: "body must be { question: string }" });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: "question too long (max 2000 chars)" });
  }

  try {
    // 1. Semantic-cache lookup.
    const hit = await lookup(question);

    if (hit) {
      const latencyMs = Date.now() - t0;
      recordHit(latencyMs);
      return res.json({
        cacheHit: true,
        prompt: question,
        answer: hit.response,
        matchedSimilarity: hit.similarity,
        entryId: hit.entryId,
        latencyMs,
        estimatedSavingsUsd: config.estimatedCostPerLlmCallUsd,
        model: config.gemini.chatModel,
      });
    }

    // 2. Cache miss → call Gemini.
    const { text, tokensIn, tokensOut } = await ask(question);

    // 3. Persist for future similar prompts (don't block the response on it).
    store(question, text);

    const latencyMs = Date.now() - t0;
    recordMiss(latencyMs);
    return res.json({
      cacheHit: false,
      prompt: question,
      answer: text,
      tokensIn,
      tokensOut,
      latencyMs,
      estimatedSavingsUsd: 0,
      model: config.gemini.chatModel,
    });
  } catch (err) {
    console.error("[/ask] error:", err);
    return res.status(500).json({
      error: "request failed",
      detail: err?.message ?? String(err),
    });
  }
});

/* -------------------------------- /metrics ------------------------------- */
// Used by the frontend dashboard.

app.get("/metrics", (_req, res) => {
  res.json(snapshot());
});

/* -------------------------------- /health -------------------------------- */

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* --------------------------------- boot ---------------------------------- */

app.listen(config.port, () => {
  console.log(`\n  ⚡ demo-langcache listening on http://localhost:${config.port}`);
  console.log(`     model:      ${config.gemini.chatModel}`);
  console.log(`     threshold:  ${config.langcache.similarityThreshold}`);
  console.log(`     langcache:  https://${config.langcache.host}`);
  console.log(`     cacheId:    ${config.langcache.cacheId}\n`);
});
