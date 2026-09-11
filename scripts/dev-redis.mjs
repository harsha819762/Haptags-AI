import { RedisMemoryServer } from "redis-memory-server";

const redisServer = new RedisMemoryServer({
  instance: { port: 6379, ip: "127.0.0.1" },
});

async function main() {
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  console.log(`[redis] ready on redis://${host}:${port}`);
  console.log("[redis] press Ctrl+C to stop");
}

async function shutdown() {
  console.log("\n[redis] stopping...");
  await redisServer.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((error) => {
  console.error("[redis] failed to start:", error);
  process.exit(1);
});
