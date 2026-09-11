import type { FastifyInstance } from "fastify";
import { prisma } from "@haptags/db";

interface CreateProjectBody {
  name: string;
  kind?: "image" | "video" | "mixed";
}

export async function projectRoutes(app: FastifyInstance) {
  app.get("/v1/projects", { onRequest: [app.authenticate] }, async (request) => {
    const { orgId } = request.user;
    return prisma.project.findMany({
      where: { orgId },
      orderBy: { updatedAt: "desc" },
    });
  });

  app.post<{ Body: CreateProjectBody }>(
    "/v1/projects",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const { name, kind } = request.body;
      if (!name) return reply.code(400).send({ error: "name is required" });
      const project = await prisma.project.create({
        data: { orgId, name, kind: kind ?? "mixed" },
      });
      return reply.code(201).send(project);
    },
  );

  app.get<{ Params: { id: string } }>(
    "/v1/projects/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { orgId } = request.user;
      const project = await prisma.project.findFirst({
        where: { id: request.params.id, orgId },
        include: { characters: true, assets: true },
      });
      if (!project) return reply.code(404).send({ error: "Project not found" });
      return project;
    },
  );
}
