import type { FastifyInstance } from "fastify";
import { prisma } from "@haptags/db";

interface CreateCharacterBody {
  projectId: string;
  name: string;
  referenceAssetIds?: string[];
}

export async function characterRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateCharacterBody }>(
    "/v1/characters",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const { projectId, name, referenceAssetIds } = request.body;
      if (!projectId || !name) {
        return reply.code(400).send({ error: "projectId and name are required" });
      }
      const project = await prisma.project.findFirst({ where: { id: projectId, orgId } });
      if (!project) return reply.code(404).send({ error: "Project not found" });

      const character = await prisma.character.create({
        data: { projectId, name, referenceAssetIds: referenceAssetIds ?? [] },
      });
      return reply.code(201).send(character);
    },
  );
}
