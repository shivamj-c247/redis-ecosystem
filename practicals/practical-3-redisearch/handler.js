const { getRedis } = require("./lib/redis");

const INDEX_NAME = "idx:docs";

function ok(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function bad(message, code = 400) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}

function buildQuery(q, tag) {
  const parts = [];
  if (q && q.trim()) {
    const safe = q.replace(/[^\w\s*]/g, " ").trim();
    parts.push(`@title|body:(${safe})`);
  }
  if (tag) {
    parts.push(`@tags:{${tag}}`);
  }
  return parts.length ? parts.join(" ") : "*";
}

module.exports.search = async (event) => {
  const started = Date.now();
  const { q, tag, limit } = event.queryStringParameters || {};
  if (!q && !tag) return bad("provide ?q=... or ?tag=...");

  const redis = await getRedis();
  const query = buildQuery(q, tag);
  const max = Math.min(parseInt(limit, 10) || 10, 50);

  try {
    const result = await redis.ft.search(INDEX_NAME, query, {
      LIMIT: { from: 0, size: max },
    });
    return ok({
      ms: Date.now() - started,
      query,
      total: result.total,
      results: result.documents.map((d) => ({
        id: d.id.replace(/^doc:/, ""),
        title: d.value.title,
        body: d.value.body,
        tags: d.value.tags,
      })),
    });
  } catch (err) {
    if (String(err.message).includes("Unknown index name")) {
      return bad("Index not found. Run `npm run seed` first.", 404);
    }
    throw err;
  }
};
