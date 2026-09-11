"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError, setToken, setStoredUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setStoredUser({ email: res.user.email });
      router.push("/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-serif font-bold text-lg">
          Haptags
        </Link>
        <h1 className="font-serif font-bold text-2xl mt-6 mb-1">Log in</h1>
        <p className="text-sm text-[#46566A] mb-6">Welcome back.</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 rounded-md border border-[#DCE3EA] bg-white focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 rounded-md border border-[#DCE3EA] bg-white focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
            />
          </label>

          {error && <p className="text-sm text-[#D03B3B]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2.5 rounded-md bg-[#2A78D6] text-white font-medium hover:bg-[#1E5AA8] disabled:opacity-60 transition-colors"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-[#46566A] mt-6">
          No account?{" "}
          <Link href="/signup" className="text-[#2A78D6] font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
