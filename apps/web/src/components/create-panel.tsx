"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, type Project, type Generation } from "@/lib/api";

type Kind = "images" | "videos" | "audio";

const COST_HINT: Record<Kind, number> = { images: 5, videos: 50, audio: 10 };

export function CreatePanel({
  kind,
  title,
  description,
  showStyle,
  showVideoFields,
  promptLabel,
  promptPlaceholder,
}: {
  kind: Kind;
  title: string;
  description: string;
  showStyle?: boolean;
  showVideoFields?: boolean;
  promptLabel: string;
  promptPlaceholder: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState("1080p");
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<Generation | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listProjects().then((list) => {
      setProjects(list);
      if (list[0]) setProjectId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!job || job.status === "completed" || job.status === "failed") return;
    const timer = setInterval(async () => {
      const updated = await api.getJob(job.id);
      setJob(updated);
    }, 1500);
    return () => clearInterval(timer);
  }, [job]);

  useEffect(() => {
    if (job?.status === "completed" && job.outputAssetIds[0]) {
      api.getAsset(job.outputAssetIds[0]).then((asset) => setAssetUrl(asset.storageKey));
    }
  }, [job]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!projectId || !prompt.trim()) return;
    setSubmitting(true);
    setError(null);
    setJob(null);
    setAssetUrl(null);
    setMediaError(false);
    try {
      const created = await api.createGeneration(kind, {
        projectId,
        prompt,
        ...(showStyle ? { style } : {}),
        ...(showVideoFields ? { durationSeconds: duration, resolution } : {}),
      });
      setJob(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif font-bold text-2xl mb-1">{title}</h1>
      <p className="text-[#46566A] text-sm mb-8">{description}</p>

      {projects.length === 0 ? (
        <p className="text-sm text-[#8A97A6]">
          You need a project first.{" "}
          <Link href="/app/projects" className="text-[#2A78D6] font-medium">
            Create one
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 border border-[#DCE3EA] rounded-lg p-5 bg-white">
          <label className="flex flex-col gap-1.5 text-sm">
            Project
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            {promptLabel}
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={promptPlaceholder}
              className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF] resize-none"
            />
          </label>

          <div className="flex flex-wrap gap-4">
            {showStyle && (
              <label className="flex flex-col gap-1.5 text-sm">
                Style
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
                >
                  {["cinematic", "realistic", "anime", "product photography", "illustration"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}
            {showVideoFields && (
              <>
                <label className="flex flex-col gap-1.5 text-sm">
                  Duration (sec)
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="px-3 py-2 rounded-md border border-[#DCE3EA] w-28 focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  Resolution
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="px-3 py-2 rounded-md border border-[#DCE3EA] focus:outline-none focus:ring-2 focus:ring-[#86B6EF]"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </label>
              </>
            )}
          </div>

          {error && <p className="text-sm text-[#D03B3B]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-4 py-2 rounded-md bg-[#2A78D6] text-white font-medium hover:bg-[#1E5AA8] disabled:opacity-60 transition-colors"
          >
            {submitting ? "Submitting…" : `Generate (${COST_HINT[kind]} credits)`}
          </button>
        </form>
      )}

      {job && (
        <div className="mt-6 border border-[#DCE3EA] rounded-lg p-5 bg-white">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs uppercase tracking-wider">
            <StatusDot status={job.status} />
            {job.status}
          </div>
          {job.status === "failed" && (
            <p className="text-sm text-[#D03B3B]">{job.error}</p>
          )}
          {job.status === "completed" && assetUrl && mediaError && (
            <p className="text-sm text-[#B87800]">
              The generated file didn&apos;t load.{" "}
              <a href={assetUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Open it directly
              </a>{" "}
              instead.
            </p>
          )}
          {job.status === "completed" && kind === "images" && assetUrl && !mediaError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetUrl}
              alt={prompt}
              onError={() => setMediaError(true)}
              className="rounded-md max-w-sm border border-[#DCE3EA]"
            />
          )}
          {job.status === "completed" && kind === "videos" && assetUrl && !mediaError && (
            <video
              controls
              src={assetUrl}
              onError={() => setMediaError(true)}
              className="rounded-md max-w-sm border border-[#DCE3EA]"
            />
          )}
          {job.status === "completed" && kind === "audio" && assetUrl && !mediaError && (
            <audio controls src={assetUrl} onError={() => setMediaError(true)} className="w-full max-w-sm" />
          )}
          {(job.status === "queued" || job.status === "processing") && (
            <p className="text-sm text-[#8A97A6]">
              {kind === "videos"
                ? "Video runs on a self-hosted model with no GPU on this machine — this can take several minutes. Feel free to leave this page and check Generation history later."
                : "This can take up to a couple of minutes on first use, while the model loads."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: Generation["status"] }) {
  const color =
    status === "completed"
      ? "text-[#0CA30C]"
      : status === "failed"
        ? "text-[#D03B3B]"
        : "text-[#B87800]";
  return <span className={color}>●</span>;
}
