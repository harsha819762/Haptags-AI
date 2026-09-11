"use client";

import { useRef, useState, type ReactNode } from "react";

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateZ(0)`,
      "--glow-x": `${(px + 0.5) * 100}%`,
      "--glow-y": `${(py + 0.5) * 100}%`,
    } as React.CSSProperties);
  }

  function onMouseLeave() {
    setStyle({ transform: "perspective(700px) rotateX(0deg) rotateY(0deg)" });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, transition: "transform 200ms ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
}
