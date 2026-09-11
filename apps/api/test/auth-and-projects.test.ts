import { describe, it, expect, beforeAll } from "vitest";
import { buildApp } from "../src/app.js";
import type { FastifyInstance } from "fastify";

describe("auth and projects", () => {
  let app: FastifyInstance;
  const email = `test-${Date.now()}@haptags.com`;
  const password = "correct-horse-battery";

  beforeAll(async () => {
    app = await buildApp();
  });

  it("rejects protected routes without a token", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/projects" });
    expect(res.statusCode).toBe(401);
  });

  it("signs up, creates an org, and issues a token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/signup",
      payload: { email, password, orgName: "Test Org" },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.token).toBeTypeOf("string");
    expect(body.organization.creditBalance).toBe(100);
  });

  it("rejects a duplicate signup", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/signup",
      payload: { email, password, orgName: "Test Org" },
    });
    expect(res.statusCode).toBe(409);
  });

  it("rejects login with the wrong password", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password: "wrong-password" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("logs in and creates a project scoped to the org", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password },
    });
    const { token } = login.json();

    const created = await app.inject({
      method: "POST",
      url: "/v1/projects",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Test Project", kind: "image" },
    });
    expect(created.statusCode).toBe(201);

    const list = await app.inject({
      method: "GET",
      url: "/v1/projects",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(list.statusCode).toBe(200);
    const projects = list.json();
    expect(projects.some((p: { name: string }) => p.name === "Test Project")).toBe(true);
  });
});
