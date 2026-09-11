"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-colors duration-300 ${
        scrolled ? "bg-[#0A0B0D]/90 border-b border-white/10 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-serif font-bold text-lg tracking-tight">Haptags</span>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-[#A9A6A0]">
          {[
            { href: "#product", label: "Product" },
            { href: "#pricing", label: "Pricing" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="relative group py-1">
              <span className="group-hover:text-[#F3F1EC] transition-colors">{item.label}</span>
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#E8963C] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <span className="text-[#6E6B66] cursor-default">API</span>
          <span className="text-[#6E6B66] cursor-default">Enterprise</span>
        </nav>
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
    </header>
  );
}
