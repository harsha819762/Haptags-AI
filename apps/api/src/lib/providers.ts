import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type GenerationKind = "image" | "video" | "audio" | "upscale";

export interface GenerateParams {
  kind: GenerationKind;
  prompt?: string;
  referenceAssetId?: string;
  durationSeconds?: number;
  resolution?: string;
  style?: string;
  qualityTier?: "draft" | "standard" | "premium";
}

export interface ProviderResult {
  outputUrl: string;
  costCredits: number;
}

export interface ProviderAdapter {
  name: string;
  supports(kind: GenerationKind): boolean;
  costPerUnitCredits(kind: GenerationKind): number;
  generate(params: GenerateParams): Promise<ProviderResult>;
}

// Real, publicly hosted sample media so the mock provider returns something
// actually playable instead of a URL that resolves nowhere. (Google's old
// gtv-videos-bucket sample set — commonly used in tutorials for years —
// started returning 403 AccessDenied on anonymous reads; these were each
// verified reachable directly before being added here.)
const SAMPLE_VIDEOS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
];
const SAMPLE_AUDIO = Array.from(
  { length: 10 },
  (_, i) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`,
);

function pickBySeed<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return items[hash % items.length];
}

/**
 * Placeholder adapter used until real provider API keys (fal.ai, Replicate,
 * Kling, ElevenLabs, ...) are wired in — lets the full queue -> worker ->
 * storage pipeline be exercised end to end without external cost.
 */
const mockProvider: ProviderAdapter = {
  name: "mock-provider",
  supports: () => true,
  costPerUnitCredits(kind) {
    return { image: 5, video: 50, audio: 10, upscale: 30 }[kind];
  },
  async generate(params) {
    // Simulates provider latency so the queued -> processing -> completed
    // state machine in the worker is actually observable.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const seed = params.prompt?.slice(0, 40) ?? params.kind;
    const outputUrl =
      params.kind === "image"
        ? `https://picsum.photos/seed/${encodeURIComponent(seed)}/1024/1024`
        : params.kind === "audio"
          ? pickBySeed(SAMPLE_AUDIO, seed)
          : pickBySeed(SAMPLE_VIDEOS, seed);
    return { outputUrl, costCredits: mockProvider.costPerUnitCredits(params.kind) };
  },
};

const STORAGE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "storage");
const INFERENCE_URL = process.env.INFERENCE_URL ?? "http://localhost:8001";
const PUBLIC_API_URL = process.env.PUBLIC_API_URL ?? "http://localhost:4000";

const SELF_HOSTED_ENDPOINT: Record<"image" | "audio" | "video", string> = {
  image: "/generate/image",
  audio: "/generate/audio",
  video: "/generate/video",
};
const SELF_HOSTED_EXT: Record<"image" | "audio" | "video", string> = {
  image: "png",
  audio: "wav",
  video: "mp4",
};

/**
 * Real, self-hosted, open-weight models — no third-party AI provider API,
 * no external account. Wraps the FastAPI service in apps/inference
 * (segmind/tiny-sd for image, Piper TTS for audio, damo-vilab/
 * text-to-video-ms-1.7b for video). Video is a proof of concept: there is
 * no GPU on this host, so a single clip can take many minutes.
 */
const selfHostedProvider: ProviderAdapter = {
  name: "self-hosted",
  supports(kind) {
    // Video is intentionally excluded: damo-vilab/text-to-video-ms-1.7b
    // produces incoherent noise under the current diffusers version on this
    // CPU-only host (verified directly — not a step-count/quality issue, the
    // legacy pipeline's output doesn't denoise into a real image even at 25
    // steps). Falls through to the mock provider until that's root-caused,
    // rather than serving static labeled as a real generation.
    return kind === "image" || kind === "audio";
  },
  costPerUnitCredits(kind) {
    return { image: 5, video: 50, audio: 10, upscale: 30 }[kind];
  },
  async generate(params) {
    const kind = params.kind as "image" | "audio" | "video";
    const body = kind === "audio" ? { text: params.prompt ?? "" } : { prompt: params.prompt ?? "" };

    const res = await fetch(`${INFERENCE_URL}${SELF_HOSTED_ENDPOINT[kind]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Video with no GPU is genuinely slow — give it real headroom.
      signal: AbortSignal.timeout(kind === "video" ? 20 * 60_000 : 5 * 60_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(`Inference service ${kind} generation failed (${res.status}): ${detail.slice(0, 500)}`);
    }

    const bytes = Buffer.from(await res.arrayBuffer());
    const filename = `${randomUUID()}.${SELF_HOSTED_EXT[kind]}`;
    await writeFile(path.join(STORAGE_DIR, filename), bytes);

    return {
      outputUrl: `${PUBLIC_API_URL}/generated/${filename}`,
      costCredits: selfHostedProvider.costPerUnitCredits(params.kind),
    };
  },
};

const registry: ProviderAdapter[] = [selfHostedProvider, mockProvider];

/**
 * The model router's selection step (see blueprint §5): filters candidates by
 * capability, then ranks by cost. Only one adapter exists today, so this is a
 * pass-through — but every call site in the codebase already goes through
 * here, so adding real providers later is additive, not a rewrite.
 */
export function selectProvider(kind: GenerationKind): ProviderAdapter {
  const candidates = registry.filter((p) => p.supports(kind));
  if (candidates.length === 0) {
    throw new Error(`No provider registered for kind "${kind}"`);
  }
  return candidates.sort(
    (a, b) => a.costPerUnitCredits(kind) - b.costPerUnitCredits(kind),
  )[0];
}
