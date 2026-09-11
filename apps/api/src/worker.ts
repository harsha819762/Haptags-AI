import { Worker, type Job } from "bullmq";
import { prisma } from "@haptags/db";
import { redisConnection, GENERATIONS_QUEUE, type GenerationJobData } from "./lib/queue.js";
import { selectProvider, type GenerationKind } from "./lib/providers.js";

async function processGeneration(job: Job<GenerationJobData>) {
  const generation = await prisma.generation.findUniqueOrThrow({
    where: { id: job.data.generationId },
    include: { project: true },
  });

  await prisma.generation.update({
    where: { id: generation.id },
    data: { status: "processing" },
  });

  const provider = selectProvider(generation.kind as GenerationKind);
  const params = (generation.params ?? {}) as Record<string, unknown>;

  const result = await provider.generate({
    kind: generation.kind as GenerationKind,
    prompt: generation.prompt ?? undefined,
    referenceAssetId: generation.inputAssetIds[0],
    durationSeconds: params.durationSeconds as number | undefined,
    resolution: params.resolution as string | undefined,
    style: params.style as string | undefined,
    qualityTier: params.qualityTier as "draft" | "standard" | "premium" | undefined,
  });

  const asset = await prisma.asset.create({
    data: {
      projectId: generation.projectId,
      kind: generation.kind === "video" ? "video" : generation.kind === "audio" ? "audio" : "image",
      storageKey: result.outputUrl,
      mimeType: generation.kind === "video" ? "video/mp4" : generation.kind === "audio" ? "audio/mpeg" : "image/png",
    },
  });

  await prisma.$transaction([
    prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: "completed",
        provider: provider.name,
        costCredits: result.costCredits,
        outputAssetIds: [asset.id],
        completedAt: new Date(),
      },
    }),
    prisma.organization.update({
      where: { id: generation.project.orgId },
      data: { creditBalance: { decrement: result.costCredits } },
    }),
    prisma.creditLedgerEntry.create({
      data: {
        orgId: generation.project.orgId,
        delta: -result.costCredits,
        reason: `${generation.kind} generation via ${provider.name}`,
        generationId: generation.id,
      },
    }),
  ]);
}

const worker = new Worker<GenerationJobData>(
  GENERATIONS_QUEUE,
  async (job) => {
    try {
      await processGeneration(job);
    } catch (error) {
      await prisma.generation.update({
        where: { id: job.data.generationId },
        data: { status: "failed", error: error instanceof Error ? error.message : "Unknown error" },
      });
      throw error;
    }
  },
  { connection: redisConnection, concurrency: 4 },
);

worker.on("completed", (job) => {
  console.log(`[worker] generation ${job.data.generationId} completed`);
});
worker.on("failed", (job, error) => {
  console.error(`[worker] generation ${job?.data.generationId} failed:`, error.message);
});

console.log("[worker] listening on queue:", GENERATIONS_QUEUE);
