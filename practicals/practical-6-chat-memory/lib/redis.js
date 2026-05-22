const { createClient } = require("redis");

let client;

async function getRedis() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => console.error("[redis]", err));
  await client.connect();
  return client;
}

module.exports = { getRedis };
