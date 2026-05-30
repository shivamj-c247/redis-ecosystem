// Frontend logic for the LangCache demo.
//
// Responsibilities:
//   1. Submit the question to POST /ask.
//   2. Show prompt + answer + hit/miss verdict + latency + savings.
//   3. Append to a small recent-queries history list.
//   4. Refresh the dashboard counters from /metrics on a cadence.

const $ = (id) => document.getElementById(id);

const form = $("ask-form");
const q = $("q");
const sendBtn = $("send");
const result = $("result");
const verdict = $("verdict");
const latency = $("latency");
const similarity = $("similarity");
const tokens = $("tokens");
const saved = $("saved");
const rPrompt = $("r-prompt");
const rAnswer = $("r-answer");
const history = $("history");
const historyEmpty = $("history-empty");

const dash = {
  total: $("m-total"),
  hits: $("m-hits"),
  rate: $("m-rate"),
  ms: $("m-ms"),
  usd: $("m-usd"),
};

/* ---------- demo-prompt chips ---------- */

document.querySelectorAll(".chip").forEach((el) => {
  el.addEventListener("click", () => {
    q.value = el.dataset.prompt ?? "";
    q.focus();
  });
});

/* ---------- submit ---------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = q.value.trim();
  if (!question) return;

  setLoading(true);
  try {
    const t0 = performance.now();
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || "request failed");
    }

    const data = await res.json();
    // If the server didn't report latency for any reason, fall back to wall-clock.
    if (!data.latencyMs) data.latencyMs = Math.round(performance.now() - t0);

    render(data);
    pushHistory(data);
    refreshMetrics();
  } catch (err) {
    rPrompt.textContent = question;
    rAnswer.textContent = `⚠️  ${err.message}`;
    verdict.textContent = "ERROR";
    verdict.className = "verdict miss";
    result.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  sendBtn.disabled = on;
  sendBtn.classList.toggle("is-loading", on);
  sendBtn.querySelector(".send-text").textContent = on ? "Thinking" : "Ask";
}

/* ---------- render ---------- */

function render(d) {
  rPrompt.textContent = d.prompt;
  rAnswer.textContent = d.answer ?? "(no answer)";

  if (d.cacheHit) {
    verdict.textContent = "✓  CACHE HIT";
    verdict.className = "verdict hit";
  } else {
    verdict.textContent = "→  CACHE MISS";
    verdict.className = "verdict miss";
  }

  latency.textContent = `${d.latencyMs} ms`;
  latency.classList.remove("hidden");

  if (d.matchedSimilarity != null) {
    const pct = (d.matchedSimilarity * 100).toFixed(1);
    similarity.textContent = `similarity ${pct}%`;
    similarity.classList.remove("hidden");
  } else {
    similarity.classList.add("hidden");
  }

  if (d.tokensOut) {
    tokens.textContent = `${d.tokensIn ?? 0}→${d.tokensOut} tokens`;
    tokens.classList.remove("hidden");
  } else {
    tokens.classList.add("hidden");
  }

  if (d.estimatedSavingsUsd && d.estimatedSavingsUsd > 0) {
    saved.textContent = `saved $${d.estimatedSavingsUsd.toFixed(4)}`;
    saved.classList.remove("hidden");
  } else {
    saved.classList.add("hidden");
  }

  result.classList.remove("hidden");
}

/* ---------- history ---------- */

const HISTORY_MAX = 8;
const items = [];

function pushHistory(d) {
  items.unshift({
    q: d.prompt,
    hit: !!d.cacheHit,
    ms: d.latencyMs,
  });
  while (items.length > HISTORY_MAX) items.pop();
  history.innerHTML = items
    .map(
      (it) => `
      <li>
        <span class="h-tag ${it.hit ? "hit" : "miss"}">${it.hit ? "HIT" : "MISS"}</span>
        <span class="h-q">${escapeHtml(it.q)}</span>
        <span class="h-ms">${it.ms} ms</span>
      </li>`
    )
    .join("");
  historyEmpty.style.display = items.length ? "none" : "inline";
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

/* ---------- metrics polling ---------- */

async function refreshMetrics() {
  try {
    const r = await fetch("/metrics");
    if (!r.ok) return;
    const m = await r.json();
    dash.total.textContent = m.totalRequests;
    dash.hits.textContent = m.cacheHits;
    dash.rate.textContent = `${Math.round((m.hitRate ?? 0) * 100)}%`;
    dash.ms.textContent = `${m.msSavedTotal} ms`;
    dash.usd.textContent = `$${(m.usdSavedTotal ?? 0).toFixed(4)}`;
  } catch {
    /* ignore */
  }
}
refreshMetrics();
setInterval(refreshMetrics, 4000);
