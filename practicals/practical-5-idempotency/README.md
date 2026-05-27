# Practical 5 — Idempotency

**Pattern:** `SET key value NX EX seconds` — the canonical idempotency primitive.

Same `Idempotency-Key` header → same response, even on retries. Stripe and AWS use this exact pattern to prevent double-charging on network flakes.

## Run

```bash
cp .env.example .env
npm install
npx serverless offline
```

## Try it

```bash
# Same key, multiple calls — Gemini called ONCE.
KEY=$(uuidgen)
for i in 1 2 3; do
  curl -X POST http://localhost:3000/dev/generate \
    -H "Content-Type: application/json" \
    -H "Idempotency-Key: $KEY" \
    -d '{"prompt":"Write a haiku about Redis"}'
  echo
done
```

First call: `replayed: false`, returns the answer and stores it.
Calls 2–3: `replayed: true`, return the same answer instantly with **zero** new Gemini calls.

## The code that matters

```js
const claimed = await redis.set(
  `idem:${key}`,
  "processing",
  { NX: true, EX: 60 }
);

if (claimed === null) {
  const existing = await redis.get(`idem:${key}`);
  if (existing === "processing") return 409;       // in flight
  return { ...JSON.parse(existing), replayed: true };
}

const response = await ai.models.generateContent({
  model: "gemini-flash-latest",
  contents: prompt,
});
await redis.set(`idem:${key}`, JSON.stringify(response), { EX: 86400 });
```

## Real-world simulation

```bash
KEY=$(uuidgen)
curl --retry 3 -X POST http://localhost:3000/dev/generate \
  -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"prompt":"Same"}'
```

`--retry 3` retries on network failure. With idempotency: 1 Gemini call. Without: up to 3.
