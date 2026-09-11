# Haptags Platform

Year-1 build of Haptags' AI creative generation platform. See the [technical
blueprint](https://claude.ai/code/artifact/0bca204a-33bd-4e29-8e5e-63f60abdb297)
for the full architecture, schema, and roadmap this implements.

## Structure

```
apps/web    Next.js frontend (Phase 1 screens)
apps/api    Fastify backend — auth, projects, characters, credits, generations
apps/api    also ships the BullMQ worker (src/worker.ts)
packages/db Prisma schema + generated client, shared by apps/api
```

## Local development

No Docker/WSL required — Postgres and Redis run as portable, no-admin binaries
under `.runtime/` via `embedded-postgres` and `redis-memory-server`.

```bash
npm install

# terminal 1 — Postgres (embedded, portable, no admin required)
npm run infra:postgres

# terminal 2 — Redis-compatible server (Memurai binary via redis-memory-server)
npm run infra:redis

# one-time / after schema changes
npm run db:migrate
npm run db:generate

# terminal 3 — API
npm run dev:api        # http://localhost:4000

# terminal 4 — generation worker (BullMQ)
npm run dev:worker

# terminal 5 — frontend
npm run dev:web         # http://localhost:3000
```

Image/video/audio generation currently routes through a mock provider
(`apps/api/src/lib/providers.ts`) that simulates provider latency and returns
a placeholder asset — this exercises the full queued → processing →
completed pipeline and credit debit without needing real provider API keys
yet. Swap in real adapters (fal.ai, Replicate, Kling, ElevenLabs, ...) there
when ready; every call site already goes through `selectProvider()`.
