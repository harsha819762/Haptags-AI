import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@haptags/db";
import { processGeneration } from "../src/worker.js";
import { redisConnection } from "../src/lib/queue.js";
import type { Job } from "bullmq";

describe("processGeneration", () => {
  afterAll(async () => {
    await prisma.$disconnect();
    redisConnection.disconnect();
  });

  it("runs a queued generation through to completed and debits credits", async () => {
    const organization = await prisma.organization.create({
      data: { name: "Worker Test Org", creditBalance: 100 },
    });
    const user = await prisma.user.create({
      data: {
        orgId: organization.id,
        email: `worker-test-${Date.now()}@haptags.com`,
        passwordHash: "unused",
        role: "owner",
      },
    });
    const project = await prisma.project.create({
      data: { orgId: organization.id, name: "Worker Test Project", kind: "image" },
    });
    // "upscale" is the one kind self-hosted doesn't support yet, so this
    // deterministically exercises the mock provider without depending on
    // the (slow, separately-running) real inference service being up.
    const generation = await prisma.generation.create({
      data: {
        projectId: project.id,
        userId: user.id,
        kind: "upscale",
        status: "queued",
        prompt: "a test poster",
        params: { style: "cinematic" },
      },
    });

    await processGeneration({ data: { generationId: generation.id } } as Job<{ generationId: string }>);

    const updated = await prisma.generation.findUniqueOrThrow({ where: { id: generation.id } });
    expect(updated.status).toBe("completed");
    expect(updated.provider).toBe("mock-provider");
    expect(updated.costCredits).toBeGreaterThan(0);
    expect(updated.outputAssetIds.length).toBe(1);

    const org = await prisma.organization.findUniqueOrThrow({ where: { id: organization.id } });
    expect(org.creditBalance).toBe(100 - updated.costCredits);

    const ledger = await prisma.creditLedgerEntry.findMany({ where: { orgId: organization.id } });
    expect(ledger).toHaveLength(1);
    expect(ledger[0].delta).toBe(-updated.costCredits);
  });
});
