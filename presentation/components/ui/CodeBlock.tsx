"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
}

// Pretty-printed code block with light syntax styling.
// We do regex-based highlighting (no Shiki on the client) to keep the bundle
// small — this is a keynote, not an editor.
export function CodeBlock({ code, language = "js", className = "", showCopy = true }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-redis-line bg-black/40 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-redis-line px-4 py-2 text-xs text-redis-muted">
        <span className="font-mono">{language}</span>
        {showCopy && (
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/5 hover:text-white"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "copied" : "copy"}
          </button>
        )}
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlight(code, language) }}
        />
      </pre>
    </div>
  );
}

function highlight(code: string, lang: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "bash" || lang === "sh") {
    return escaped
      .replace(/(^|\n)([#].*)/g, '$1<span style="color:#6b7280">$2</span>')
      .replace(
        /\b(curl|npm|npx|cd|cp|export|echo|set|get|del|hset|hget|lpush|rpush|sadd|zadd|xadd)\b/gi,
        '<span style="color:#ff6b6b">$1</span>'
      );
  }

  return (
    escaped
      // comments
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#6b7280">$1</span>')
      // strings
      .replace(
        /("[^"]*"|'[^']*'|`[^`]*`)/g,
        '<span style="color:#94d4a3">$1</span>'
      )
      // keywords
      .replace(
        /\b(const|let|var|function|async|await|return|if|else|new|import|from|export|require|module|class|extends|null|true|false|undefined)\b/g,
        '<span style="color:#ff6b6b">$1</span>'
      )
      // Redis-ish CAPS commands
      .replace(
        /\b(SET|GET|HSET|HGET|HGETALL|LPUSH|RPUSH|LRANGE|SADD|SMEMBERS|ZADD|ZRANGE|XADD|XRANGE|FT\.CREATE|FT\.SEARCH|INCR|EXPIRE|EX|NX|KNN|HNSW|COSINE|VECTOR|TEXT|TAG|HASH|PREFIX|SCHEMA)\b/g,
        '<span style="color:#fdba74">$1</span>'
      )
      // numbers
      .replace(/\b(\d+)\b/g, '<span style="color:#a5b4fc">$1</span>')
  );
}
