"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StatusTag, type Status } from "@/components/status-tag";
import { CREATE_ITEMS, PLATFORM_ITEMS, STUDIO_ITEMS, COMPANY_ITEMS } from "@/lib/nav-data";

function ExploreColumn({ title, items }: { title: string; items: { label: string; status: Status }[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E6B66] mb-3">{title}</div>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            {item.status === "soon" ? (
              <span className="flex items-center gap-2 text-sm text-[#6E6B66] cursor-default">
                {item.label}
                <StatusTag status={item.status} />
              </span>
            ) : (
              <Link
                href="/signup"
                className="flex items-center gap-2 text-sm text-[#D8D5CE] hover:text-[#F3F1EC] transition-colors"
              >
                {item.label}
                <StatusTag status={item.status} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setExploreOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setExploreOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-20 transition-colors duration-300 ${
        scrolled || exploreOpen
          ? "bg-[#0A0B0D]/95 border-b border-white/10 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-serif font-bold text-lg tracking-tight">Haptags</span>
          <nav className="hidden sm:flex items-center gap-7 text-sm text-[#A9A6A0]">
            <button
              onClick={() => setExploreOpen((v) => !v)}
              className={`relative py-1 transition-colors ${exploreOpen ? "text-[#F3F1EC]" : "hover:text-[#F3F1EC]"}`}
              aria-expanded={exploreOpen}
            >
              Explore
              <span
                className={`absolute left-0 -bottom-0.5 h-px bg-[#E8963C] transition-all duration-300 ${
                  exploreOpen ? "w-full" : "w-0"
                }`}
              />
            </button>
            {[
              { href: "#product", label: "Product" },
              { href: "#pricing", label: "Pricing" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="relative group py-1">
                <span className="group-hover:text-[#F3F1EC] transition-colors">{item.label}</span>
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#E8963C] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <span className="text-[#6E6B66] cursor-default">Enterprise</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 text-sm text-[#A9A6A0] hover:text-[#F3F1EC] transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-md bg-[#E8963C] text-[#1A1204] text-sm font-medium hover:bg-[#F2A94E] hover:shadow-[0_0_24px_-4px_#E8963C80] transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>

      {exploreOpen && (
        <div className="border-t border-white/10 bg-[#0A0B0D]">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <ExploreColumn title="Create" items={CREATE_ITEMS} />
            <ExploreColumn title="Platform" items={PLATFORM_ITEMS} />
            <ExploreColumn title="Studios" items={STUDIO_ITEMS} />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E6B66] mb-3">Company</div>
              <ul className="flex flex-col gap-2.5">
                {COMPANY_ITEMS.map((label) => (
                  <li key={label} className="text-sm text-[#6E6B66] cursor-default">
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
