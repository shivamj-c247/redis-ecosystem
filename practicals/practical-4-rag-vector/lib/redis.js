const { createClient } = require("redis");

let client;

async function getRedis() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => console.error("[redis]", err));
  await client.connect();
  return client;
}

function floatsToBuffer(arr) {
  const buf = Buffer.alloc(arr.length * 4);
  for (let i = 0; i < arr.length; i++) buf.writeFloatLE(arr[i], i * 4);
  return buf;
}

module.exports = { getRedis, floatsToBuffer };
