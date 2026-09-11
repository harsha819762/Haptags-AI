import type { FastifyInstance } from "fastify";
import { prisma } from "@haptags/db";

export async function assetRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/v1/assets/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const asset = await prisma.asset.findFirst({
        where: { id: request.params.id, project: { orgId } },
      });
      if (!asset) return reply.code(404).send({ error: "Asset not found" });
      return asset;
    },
  );
}
