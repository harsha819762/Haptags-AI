"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Project } from "@/lib/api";

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCredits(), api.listProjects()])
      .then(([credits, projectList]) => {
        setBalance(credits.balance);
        setProjects(projectList.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif font-bold text-2xl mb-1">Dashboard</h1>
      <p className="text-[#46566A] text-sm mb-8">Everything you need to start creating.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-[#DCE3EA] rounded-lg p-5 bg-white">
          <div className="font-mono text-xs uppercase tracking-wider text-[#8A97A6] mb-2">
            Credit balance
          </div>
          <div className="font-serif font-bold text-2xl">{loading ? "…" : balance}</div>
        </div>
        <div className="border border-[#DCE3EA] rounded-lg p-5 bg-white">
          <div className="font-mono text-xs uppercase tracking-wider text-[#8A97A6] mb-2">
            Projects
          </div>
          <div className="font-serif font-bold text-2xl">{loading ? "…" : projects.length}</div>
        </div>
        <Link
          href="/app/billing"
          className="border border-[#DCE3EA] rounded-lg p-5 bg-white hover:border-[#2A78D6] transition-colors"
        >
          <div className="font-mono text-xs uppercase tracking-wider text-[#8A97A6] mb-2">
            Need more credits?
          </div>
          <div className="text-sm font-medium text-[#2A78D6]">View plans →</div>
        </Link>
      </div>

      <h2 className="font-serif font-bold text-lg mb-3">Quick create</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/app/create/image", label: "Image", desc: "Text or reference → image" },
          { href: "/app/create/video", label: "Video", desc: "Text or image → video" },
          { href: "/app/create/audio", label: "Audio", desc: "Text → speech" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-[#DCE3EA] rounded-lg p-5 bg-white hover:border-[#2A78D6] transition-colors"
          >
            <div className="font-medium mb-1">{c.label}</div>
            <div className="text-sm text-[#46566A]">{c.desc}</div>
          </Link>
        ))}
      </div>

      <h2 className="font-serif font-bold text-lg mb-3">Recent projects</h2>
      {loading ? (
        <p className="text-sm text-[#8A97A6]">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-[#8A97A6]">
          No projects yet.{" "}
          <Link href="/app/projects" className="text-[#2A78D6] font-medium">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="border border-[#DCE3EA] rounded-lg bg-white divide-y divide-[#DCE3EA]">
          {projects.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <span className="font-medium">{p.name}</span>
              <span className="font-mono text-xs text-[#8A97A6] uppercase">{p.kind}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
