export type Status = "live" | "beta" | "soon";

export function StatusTag({ status }: { status: Status }) {
  if (status === "live") {
    return <span className="text-[10px] font-mono uppercase tracking-wider text-[#3FCB3F]">Live</span>;
  }
  if (status === "beta") {
    return <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8963C]">Beta</span>;
  }
  return <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E6B66]">Soon</span>;
}
