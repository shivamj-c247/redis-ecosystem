# Practical 3 — RediSearch

**Pattern:** full-text search over hashes with `FT.CREATE` + `FT.SEARCH`.

Treats Redis as a search engine. 20 docs are indexed by title (weighted), body, and tags. Query supports text search, prefix matches, and tag filters.

## Run

```bash
cp .env.example .env
npm install
npm run seed             # one-time — populates idx:docs from ../../shared-corpus.json
npx serverless offline
```

## Try it

```bash
# Free-text search
curl "http://localhost:3000/dev/search?q=cache"

# Combine text + tag filter
curl "http://localhost:3000/dev/search?q=Redis&tag=ai"

# Tag-only browse
curl "http://localhost:3000/dev/search?tag=vector"
```

## The code that matters

```js
// One-time index creation
FT.CREATE idx:docs ON HASH PREFIX 1 doc:
  SCHEMA title TEXT WEIGHT 5 body TEXT tags TAG

// Query: text in title or body, filtered by tag
const result = await redis.ft.search(
  "idx:docs",
  "@title|body:(cache) @tags:{ai}",
  { LIMIT: { from: 0, size: 10 } }
);
```

## Notes

- `WEIGHT 5` on title means title hits rank higher than body hits.
- Tags use commas as separators by default — see `seed.js`.
- Sub-millisecond on 20 docs; scales to millions with HNSW or numeric/geo indexes.
