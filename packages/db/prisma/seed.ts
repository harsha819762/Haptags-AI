import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

const DEMO_EMAIL = "demo@haptags.com";
const DEMO_PASSWORD = "haptags-demo";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log(`Seed skipped — ${DEMO_EMAIL} already exists.`);
    return;
  }

  const organization = await prisma.organization.create({
    data: { name: "Haptags LLP", creditBalance: 100 },
  });

  const user = await prisma.user.create({
    data: {
      orgId: organization.id,
      email: DEMO_EMAIL,
      passwordHash: hashPassword(DEMO_PASSWORD),
      role: "owner",
    },
  });

  const project = await prisma.project.create({
    data: { orgId: organization.id, name: "LVS Greenwoods Ad", kind: "image" },
  });

  const asset = await prisma.asset.create({
    data: {
      projectId: project.id,
      kind: "image",
      storageKey: "https://picsum.photos/seed/lvs-greenwoods/1024/1024",
      mimeType: "image/png",
    },
  });

  const generation = await prisma.generation.create({
    data: {
      projectId: project.id,
      userId: user.id,
      kind: "image",
      status: "completed",
      provider: "mock-provider",
      prompt: "cinematic poster for a 2 acre villa community named LVS Greenwoods",
      params: { style: "cinematic" },
      costCredits: 5,
      outputAssetIds: [asset.id],
      completedAt: new Date(),
    },
  });

  await prisma.organization.update({
    where: { id: organization.id },
    data: { creditBalance: { decrement: 5 } },
  });

  await prisma.creditLedgerEntry.create({
    data: {
      orgId: organization.id,
      delta: -5,
      reason: "image generation via mock-provider",
      generationId: generation.id,
    },
  });

  console.log("Seeded demo account:");
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
