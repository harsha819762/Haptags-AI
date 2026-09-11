import type { FastifyInstance } from "fastify";
import { prisma, type GenerationKind } from "@haptags/db";
import { generationsQueue, type GenerationJobData } from "../lib/queue.js";

interface CreateGenerationBody {
  projectId: string;
  prompt?: string;
  referenceAssetId?: string;
  durationSeconds?: number;
  resolution?: string;
  style?: string;
  qualityTier?: "draft" | "standard" | "premium";
}

function registerCreateRoute(app: FastifyInstance, path: string, kind: GenerationKind) {
  app.post<{ Body: CreateGenerationBody }>(
    path,
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { sub: userId, orgId } = request.user;
      const { projectId, prompt, referenceAssetId, durationSeconds, resolution, style, qualityTier } =
        request.body;

      if (!projectId) return reply.code(400).send({ error: "projectId is required" });
      const project = await prisma.project.findFirst({ where: { id: projectId, orgId } });
      if (!project) return reply.code(404).send({ error: "Project not found" });

      const generation = await prisma.generation.create({
        data: {
          projectId,
          userId,
          kind,
          status: "queued",
          prompt,
          params: { durationSeconds, resolution, style, qualityTier } as object,
          inputAssetIds: referenceAssetId ? [referenceAssetId] : [],
        },
      });

      const jobData: GenerationJobData = { generationId: generation.id };
      await generationsQueue.add(kind, jobData, { jobId: generation.id });

      return reply.code(202).send(generation);
    },
  );
}

export async function generationRoutes(app: FastifyInstance) {
  registerCreateRoute(app, "/v1/images", "image");
  registerCreateRoute(app, "/v1/videos", "video");
  registerCreateRoute(app, "/v1/audio", "audio");
  registerCreateRoute(app, "/v1/upscale", "upscale");

  app.get("/v1/generations", { onRequest: [app.authenticate] }, async (request) => {
    const { orgId } = request.user;
    return prisma.generation.findMany({
      where: { project: { orgId } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { project: { select: { name: true } } },
    });
  });

  app.get<{ Params: { id: string } }>(
    "/v1/jobs/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const generation = await prisma.generation.findFirst({
        where: { id: request.params.id, project: { orgId } },
      });
      if (!generation) return reply.code(404).send({ error: "Job not found" });
      return generation;
    },
  );

  app.post<{ Params: { id: string } }>(
    "/v1/jobs/:id/cancel",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const generation = await prisma.generation.findFirst({
        where: { id: request.params.id, project: { orgId } },
      });
      if (!generation) return reply.code(404).send({ error: "Job not found" });
      if (generation.status !== "queued") {
        return reply.code(409).send({ error: "Only queued jobs can be cancelled" });
      }

      const job = await generationsQueue.getJob(generation.id);
      await job?.remove();

      const updated = await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "failed", error: "Cancelled by user" },
      });
      return updated;
    },
  );
}
