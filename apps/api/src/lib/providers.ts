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
    const seed = encodeURIComponent(params.prompt?.slice(0, 40) ?? params.kind);
    const outputUrl =
      params.kind === "image"
        ? `https://picsum.photos/seed/${seed}/1024/1024`
        : `https://example-storage.local/generated/${params.kind}/${seed}.mp4`;
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
