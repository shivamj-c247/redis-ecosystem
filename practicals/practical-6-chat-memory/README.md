# Practical 6 — Chat Session Memory

**Pattern:** per-session conversation history in a Redis List, capped by `LTRIM`, expired by a sliding TTL.

The chatbot "remembers" each user's session for 30 minutes of inactivity. Memory is bounded at 20 turns — older messages drop off automatically.

## Run

```bash
cp .env.example .env
npm install
npx serverless offline
```

## Try it

```bash
SID=alice-$(date +%s)

# Turn 1
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SID\",\"message\":\"My name is Alice. Remember it.\"}"

# Turn 2 — model remembers the name
curl -X POST http://localhost:3000/dev/chat \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SID\",\"message\":\"What's my name?\"}"

# Reset
curl -X DELETE http://localhost:3000/dev/chat/$SID
```

## The code that matters

```js
const history = (await redis.lRange(key, 0, -1)).reverse().map(JSON.parse);
const contents = [
  ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
  { role: "user", parts: [{ text: message }] },
];

const { text: reply } = await ai.models.generateContent({
  model: "gemini-flash-latest",
  contents,
  config: { systemInstruction: systemPrompt },
});

await redis.multi()
  .lPush(key, JSON.stringify({ role: "user", content: message }))
  .lPush(key, JSON.stringify({ role: "model", content: reply }))   // Gemini uses "model"
  .lTrim(key, 0, 39)                  // cap at 20 turns
  .expire(key, 1800)                  // sliding 30-min TTL
  .exec();
```

## Why a List (not a Stream)?

For chat history you want simple, ordered, bounded. `LPUSH` + `LTRIM` does this in two commands. Streams shine when you need consumer groups, replay, or fan-out — overkill for a chat session.
