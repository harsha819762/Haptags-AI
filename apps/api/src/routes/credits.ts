import type { FastifyInstance } from "fastify";
import { prisma } from "@haptags/db";

export async function creditRoutes(app: FastifyInstance) {
  app.get("/v1/credits", { onRequest: [app.authenticate] }, async (request, reply) => {
    const { orgId } = request.user;
    const organization = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!organization) return reply.code(404).send({ error: "Organization not found" });

    const ledger = await prisma.creditLedgerEntry.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { balance: organization.creditBalance, ledger };
  });
}
