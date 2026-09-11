import type { FastifyInstance } from "fastify";
import { prisma } from "@haptags/db";
import { hashPassword, verifyPassword } from "../lib/password.js";

interface SignupBody {
  email: string;
  password: string;
  orgName: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: SignupBody }>("/v1/auth/signup", async (request, reply) => {
    const { email, password, orgName } = request.body;
    if (!email || !password || !orgName) {
      return reply.code(400).send({ error: "email, password, and orgName are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.code(409).send({ error: "An account with this email already exists" });
    }

    const organization = await prisma.organization.create({
      data: { name: orgName },
    });
    const user = await prisma.user.create({
      data: {
        orgId: organization.id,
        email,
        passwordHash: hashPassword(password),
        role: "owner",
      },
    });

    const token = app.jwt.sign({ sub: user.id, orgId: organization.id });
    return reply.code(201).send({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      organization: { id: organization.id, name: organization.name, creditBalance: organization.creditBalance },
    });
  });

  app.post<{ Body: LoginBody }>("/v1/auth/login", async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }
    const token = app.jwt.sign({ sub: user.id, orgId: user.orgId });
    return reply.send({ token, user: { id: user.id, email: user.email, role: user.role } });
  });
}
