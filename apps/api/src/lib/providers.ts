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

const registry: ProviderAdapter[] = [mockProvider];

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
