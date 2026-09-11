"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api, type Project } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<Project["kind"]>("mixed");
  const [creating, setCreating] = useState(false);

  function refresh() {
    setLoading(true);
    api
      .listProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // Initial load: `loading` already starts `true`, so the fetch itself is
    // the only thing this effect needs to kick off.
    api
      .listProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.createProject({ name, kind });
      setName("");
      refresh();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif font-bold text-2xl mb-1">Projects</h1>
      <p className="text-[#46566A] text-sm mb-8">
        A project groups the generations, characters, and assets for one piece of work.
      </p>

      <form
        onSubmit={onCreate}
        className="flex flex-wrap items-end gap-3 mb-8 border border-[#DCE3EA] rounded-lg p-4 bg-white"
      >
        <label className="flex flex-col gap-1.5 text-sm flex-1 min-w-[200px]">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="LVS Greenwoods Ad"
            className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Kind
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Project["kind"])}
            className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
          >
            <option value="mixed">Mixed</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 rounded-md bg-[#2A78D6] text-white font-medium hover:bg-[#1E5AA8] disabled:opacity-60 transition-colors"
        >
          {creating ? "Creating…" : "New project"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[#8A97A6]">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-[#8A97A6]">No projects yet — create your first one above.</p>
      ) : (
        <div className="border border-[#DCE3EA] rounded-lg bg-white divide-y divide-[#DCE3EA]">
          {projects.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-[#8A97A6]">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className="font-mono text-xs text-[#8A97A6] uppercase">{p.kind}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
