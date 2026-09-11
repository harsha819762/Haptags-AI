"use client";

import { useEffect, useState } from "react";
import { api, type Generation } from "@/lib/api";

type Row = Generation & { project: { name: string } };

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listGenerations()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-serif font-bold text-2xl mb-1">Generation history</h1>
      <p className="text-[#46566A] text-sm mb-8">Every job you&apos;ve submitted, across all projects.</p>

      {loading ? (
        <p className="text-sm text-[#8A97A6]">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[#8A97A6]">Nothing generated yet.</p>
      ) : (
        <div className="border border-[#DCE3EA] rounded-lg bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left font-mono text-xs uppercase tracking-wider text-[#8A97A6] border-b border-[#DCE3EA]">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Prompt</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Credits</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[#DCE3EA] last:border-0">
                  <td className="px-4 py-3 font-medium">{r.project.name}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase text-[#8A97A6]">{r.kind}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-[#46566A]">{r.prompt}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{r.costCredits}</td>
                  <td className="px-4 py-3 text-[#8A97A6]">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Generation["status"] }) {
  const styles: Record<Generation["status"], string> = {
    completed: "text-[#0CA30C] border-[#0CA30C]/30",
    failed: "text-[#D03B3B] border-[#D03B3B]/30",
    processing: "text-[#B87800] border-[#B87800]/30",
    queued: "text-[#8A97A6] border-[#DCE3EA]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-xs ${styles[status]}`}>
      ● {status}
    </span>
  );
}
