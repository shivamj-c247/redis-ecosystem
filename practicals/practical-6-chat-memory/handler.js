const OpenAI = require("openai");
const { getRedis } = require("./lib/redis");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_TURNS = 20;
const SLIDING_TTL_SECONDS = 30 * 60;
const SYSTEM_PROMPT =
  "You are a helpful assistant. Use the conversation history to maintain context across turns.";

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

function keyFor(sessionId) {
  return `chat:${sessionId}`;
}

module.exports.chat = async (event) => {
  const started = Date.now();
  let sessionId, message;
  try {
    ({ sessionId, message } = JSON.parse(event.body || "{}"));
  } catch {
    return bad("invalid JSON body");
  }
  if (!sessionId || !message) {
    return bad("body must be { sessionId: string, message: string }");
  }

  const redis = await getRedis();
  const key = keyFor(sessionId);

  // LRANGE pulls oldest → newest because we LPUSH and reverse.
  const raw = await redis.lRange(key, 0, -1);
  const history = raw.reverse().map((s) => JSON.parse(s));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });
  const reply = completion.choices[0].message.content;

  // Append both turns, cap window, refresh TTL.
  await redis
    .multi()
    .lPush(key, JSON.stringify({ role: "user", content: message }))
    .lPush(key, JSON.stringify({ role: "assistant", content: reply }))
    .lTrim(key, 0, MAX_TURNS * 2 - 1)
    .expire(key, SLIDING_TTL_SECONDS)
    .exec();

  return ok({
    sessionId,
    reply,
    turns: history.length / 2 + 1,
    ms: Date.now() - started,
  });
};

module.exports.reset = async (event) => {
  const { sessionId } = event.pathParameters || {};
  if (!sessionId) return bad("sessionId required");
  const redis = await getRedis();
  const removed = await redis.del(keyFor(sessionId));
  return ok({ sessionId, removed: removed === 1 });
};
