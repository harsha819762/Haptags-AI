const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("haptags_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("haptags_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("haptags_token");
}

export function getStoredUser(): { email: string; organizationName?: string } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("haptags_user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: { email: string; organizationName?: string }) {
  window.localStorage.setItem("haptags_user", JSON.stringify(user));
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error ?? "Request failed", res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface Organization {
  id: string;
  name: string;
  creditBalance: number;
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  kind: "image" | "video" | "mixed";
  createdAt: string;
  updatedAt: string;
}

export interface Generation {
  id: string;
  projectId: string;
  kind: "image" | "video" | "audio" | "upscale";
  status: "queued" | "processing" | "completed" | "failed";
  provider: string | null;
  prompt: string | null;
  costCredits: number;
  outputAssetIds: string[];
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}

export const api = {
  signup: (data: { email: string; password: string; orgName: string }) =>
    request<{ token: string; user: { email: string }; organization: Organization }>(
      "/v1/auth/signup",
      { method: "POST", body: JSON.stringify(data) },
    ),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { email: string } }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  listProjects: () => request<Project[]>("/v1/projects"),
  createProject: (data: { name: string; kind?: Project["kind"] }) =>
    request<Project>("/v1/projects", { method: "POST", body: JSON.stringify(data) }),
  createGeneration: (
    kind: "images" | "videos" | "audio",
    data: { projectId: string; prompt?: string; durationSeconds?: number; resolution?: string; style?: string },
  ) => request<Generation>(`/v1/${kind}`, { method: "POST", body: JSON.stringify(data) }),
  getJob: (id: string) => request<Generation>(`/v1/jobs/${id}`),
  listGenerations: () => request<(Generation & { project: { name: string } })[]>("/v1/generations"),
  getAsset: (id: string) => request<{ id: string; storageKey: string; kind: string }>(`/v1/assets/${id}`),
  getCredits: () => request<{ balance: number; ledger: { id: string; delta: number; reason: string; createdAt: string }[] }>(
    "/v1/credits",
  ),
};
