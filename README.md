# Haptags Platform

Year-1 build of Haptags' AI creative generation platform. See the [technical
blueprint](https://claude.ai/code/artifact/0bca204a-33bd-4e29-8e5e-63f60abdb297)
for the full architecture, schema, and roadmap this implements.

## Structure

```
apps/web         Next.js frontend (Phase 1 screens)
apps/api         Fastify backend — auth, projects, characters, credits, generations
apps/api         also ships the BullMQ worker (src/worker.ts)
apps/inference   Self-hosted Python model server (image/audio/video) — see below
apps/marketing-site  Static Haptags marketing site (separate from the app)
packages/db      Prisma schema + generated client, shared by apps/api
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

# optional — demo data (creates demo@haptags.com / haptags-demo)
npm run db:seed

# optional — API test suite (auth, projects, and the worker's job pipeline)
npm run test:api
```

## Real generation — self-hosted, no third-party AI provider

Image and audio generation run on **open-weight models hosted by us**
(`apps/inference`), not a third-party AI API — no fal.ai/Replicate/ElevenLabs
account needed. A `mock-provider` fallback (`apps/api/src/lib/providers.ts`)
handles kinds the self-hosted service doesn't cover — `upscale` always, and
**`video` for now** (see below) — and is what the API test suite exercises,
so tests stay fast.

```bash
cd apps/inference
py -3.14 -m venv .venv
./.venv/Scripts/pip install torch --index-url https://download.pytorch.org/whl/cpu
./.venv/Scripts/pip install -r requirements.txt   # diffusers, piper-tts, fastapi, uvicorn, ...
./.venv/Scripts/python -m piper.download_voices en_US-lessac-medium --data-dir voices

# terminal 6 — inference server
./.venv/Scripts/python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

Models: `segmind/tiny-sd` (image), Piper TTS (audio). Generated files are
written to `apps/api/storage/` and served at `/generated/<file>` by the API.
**This host has no GPU** — image generation takes roughly 30–90s per request
once the model is warm (first request also pays a one-time ~50s model-load
cost). Set `INFERENCE_URL` in `apps/api/.env` if the inference server runs
somewhere other than `localhost:8001`.

**Video is not wired to self-hosted yet.** `server.py` has a
`/generate/video` endpoint using `damo-vilab/text-to-video-ms-1.7b`, but its
output is incoherent noise under the current `diffusers` version on this
CPU-only host — confirmed directly by inspecting raw frame output at both
10 and 25 inference steps, so it's a pipeline/version incompatibility, not a
"needs more steps" issue. `selfHostedProvider.supports()` in
`apps/api/src/lib/providers.ts` deliberately excludes `"video"` until that's
root-caused, so real requests fall through to the mock provider (a real,
playable stock clip) rather than serving static labeled as a real
generation. Candidates for a real fix: pin an older `diffusers` release
known to work with this legacy pipeline, or switch to a more actively
maintained video model (e.g. AnimateDiff on SD1.5) — either is a multi-hour
side quest given ~10 minutes per CPU test cycle, not a quick patch.
