import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const databaseDir = path.join(rootDir, ".runtime", "pgdata");

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "haptags",
  password: "haptags_dev",
  port: 5432,
  persistent: true,
});

async function main() {
  await pg.initialise();
  await pg.start();

  try {
    await pg.createDatabase("haptags");
    console.log('[postgres] created database "haptags"');
  } catch {
    console.log('[postgres] database "haptags" already exists — reusing it');
  }

  console.log("[postgres] ready on postgresql://haptags:***@localhost:5432/haptags");
  console.log("[postgres] press Ctrl+C to stop");
}

async function shutdown() {
  console.log("\n[postgres] stopping...");
  await pg.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((error) => {
  console.error("[postgres] failed to start:", error);
  process.exit(1);
});
