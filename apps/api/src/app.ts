import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { projectRoutes } from "./routes/projects.js";
import { characterRoutes } from "./routes/characters.js";
import { creditRoutes } from "./routes/credits.js";
import { generationRoutes } from "./routes/generations.js";
import { assetRoutes } from "./routes/assets.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" });
  await app.register(jwt, { secret: process.env.JWT_SECRET ?? "dev-secret-change-me" });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: "Missing or invalid authorization token" });
    }
  });

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(projectRoutes);
  await app.register(characterRoutes);
  await app.register(creditRoutes);
  await app.register(generationRoutes);
  await app.register(assetRoutes);

  return app;
}
