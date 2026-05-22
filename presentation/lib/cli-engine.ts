// Tiny in-memory Redis-like engine for the §5 CLI Simulator.
// Implements just enough commands to demo each data structure.

type ZSetEntry = { member: string; score: number };
type StreamEntry = { id: string; fields: Record<string, string> };

interface Store {
  strings: Map<string, string>;
  hashes: Map<string, Map<string, string>>;
  lists: Map<string, string[]>;
  sets: Map<string, Set<string>>;
  zsets: Map<string, ZSetEntry[]>;
  streams: Map<string, StreamEntry[]>;
}

export function createStore(): Store {
  return {
    strings: new Map(),
    hashes: new Map(),
    lists: new Map(),
    sets: new Map(),
    zsets: new Map(),
    streams: new Map(),
  };
}

function parseArgs(input: string): string[] {
  // Simple whitespace split with double-quoted spans honored.
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (!inQuote && /\s/.test(c)) {
      if (cur) out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

export interface CliResult {
  output: string;
  type: "ok" | "value" | "array" | "error" | "info";
}

function bulk(v: string | null): CliResult {
  return v === null
    ? { output: "(nil)", type: "info" }
    : { output: `"${v}"`, type: "value" };
}

function int(n: number): CliResult {
  return { output: `(integer) ${n}`, type: "value" };
}

function arr(items: string[]): CliResult {
  if (items.length === 0) return { output: "(empty array)", type: "info" };
  return {
    output: items.map((v, i) => `${i + 1}) "${v}"`).join("\n"),
    type: "array",
  };
}

function err(msg: string): CliResult {
  return { output: `(error) ${msg}`, type: "error" };
}

export function execute(store: Store, input: string): CliResult {
  const args = parseArgs(input.trim());
  if (args.length === 0) return { output: "", type: "info" };

  const cmd = args[0].toUpperCase();

  switch (cmd) {
    // ----- STRINGS -----
    case "SET": {
      if (args.length < 3) return err("wrong number of arguments");
      store.strings.set(args[1], args[2]);
      return { output: "OK", type: "ok" };
    }
    case "GET":
      return bulk(store.strings.get(args[1]) ?? null);
    case "INCR": {
      const cur = parseInt(store.strings.get(args[1]) ?? "0", 10);
      const next = cur + 1;
      store.strings.set(args[1], String(next));
      return int(next);
    }
    case "EXPIRE":
      return int(1); // mocked — no real TTL
    case "DEL":
      return int(store.strings.delete(args[1]) ? 1 : 0);

    // ----- HASHES -----
    case "HSET": {
      if (args.length < 4 || (args.length - 2) % 2 !== 0)
        return err("wrong number of arguments");
      const h = store.hashes.get(args[1]) ?? new Map();
      let added = 0;
      for (let i = 2; i < args.length; i += 2) {
        if (!h.has(args[i])) added++;
        h.set(args[i], args[i + 1]);
      }
      store.hashes.set(args[1], h);
      return int(added);
    }
    case "HGET":
      return bulk(store.hashes.get(args[1])?.get(args[2]) ?? null);
    case "HGETALL": {
      const h = store.hashes.get(args[1]);
      if (!h) return { output: "(empty)", type: "info" };
      const out: string[] = [];
      h.forEach((v, k) => out.push(k, v));
      return arr(out);
    }

    // ----- LISTS -----
    case "LPUSH":
    case "RPUSH": {
      const list = store.lists.get(args[1]) ?? [];
      const values = args.slice(2);
      if (cmd === "LPUSH") list.unshift(...values.reverse());
      else list.push(...values);
      store.lists.set(args[1], list);
      return int(list.length);
    }
    case "LRANGE": {
      const list = store.lists.get(args[1]) ?? [];
      const start = parseInt(args[2], 10);
      const stop = parseInt(args[3], 10);
      const realStop = stop < 0 ? list.length + stop : stop;
      return arr(list.slice(start, realStop + 1));
    }
    case "LLEN":
      return int(store.lists.get(args[1])?.length ?? 0);

    // ----- SETS -----
    case "SADD": {
      const s = store.sets.get(args[1]) ?? new Set();
      let added = 0;
      for (let i = 2; i < args.length; i++) {
        if (!s.has(args[i])) {
          s.add(args[i]);
          added++;
        }
      }
      store.sets.set(args[1], s);
      return int(added);
    }
    case "SMEMBERS":
      return arr([...(store.sets.get(args[1]) ?? [])]);
    case "SISMEMBER":
      return int(store.sets.get(args[1])?.has(args[2]) ? 1 : 0);

    // ----- SORTED SETS -----
    case "ZADD": {
      const z = store.zsets.get(args[1]) ?? [];
      let added = 0;
      for (let i = 2; i < args.length; i += 2) {
        const score = parseFloat(args[i]);
        const member = args[i + 1];
        const existing = z.find((e) => e.member === member);
        if (existing) existing.score = score;
        else {
          z.push({ member, score });
          added++;
        }
      }
      z.sort((a, b) => b.score - a.score);
      store.zsets.set(args[1], z);
      return int(added);
    }
    case "ZRANGE":
    case "ZREVRANGE": {
      const z = store.zsets.get(args[1]) ?? [];
      const start = parseInt(args[2], 10);
      const stop = parseInt(args[3], 10);
      const withScores = args.slice(4).some((a) => a.toUpperCase() === "WITHSCORES");
      const slice = z.slice(start, stop < 0 ? undefined : stop + 1);
      const ordered = cmd === "ZREVRANGE" ? slice : slice.slice().reverse();
      const out: string[] = [];
      for (const e of ordered) {
        out.push(e.member);
        if (withScores) out.push(String(e.score));
      }
      return arr(out);
    }

    // ----- STREAMS -----
    case "XADD": {
      const stream = store.streams.get(args[1]) ?? [];
      const idArg = args[2];
      const id =
        idArg === "*"
          ? `${Date.now()}-${stream.length}`
          : idArg;
      const fields: Record<string, string> = {};
      for (let i = 3; i < args.length; i += 2) fields[args[i]] = args[i + 1];
      stream.push({ id, fields });
      store.streams.set(args[1], stream);
      return { output: `"${id}"`, type: "value" };
    }
    case "XLEN":
      return int(store.streams.get(args[1])?.length ?? 0);
    case "XRANGE": {
      const s = store.streams.get(args[1]) ?? [];
      const out: string[] = [];
      for (const e of s) {
        out.push(`${e.id} ${JSON.stringify(e.fields)}`);
      }
      return arr(out);
    }

    case "FLUSHALL":
    case "FLUSHDB": {
      store.strings.clear();
      store.hashes.clear();
      store.lists.clear();
      store.sets.clear();
      store.zsets.clear();
      store.streams.clear();
      return { output: "OK", type: "ok" };
    }

    case "HELP":
      return {
        type: "info",
        output: [
          "Commands: SET, GET, INCR, DEL, EXPIRE,",
          "          HSET, HGET, HGETALL,",
          "          LPUSH, RPUSH, LRANGE, LLEN,",
          "          SADD, SMEMBERS, SISMEMBER,",
          "          ZADD, ZRANGE, ZREVRANGE,",
          "          XADD, XLEN, XRANGE,",
          "          FLUSHALL",
        ].join("\n"),
      };

    default:
      return err(`unknown command '${cmd}'`);
  }
}
