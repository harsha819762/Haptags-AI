"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getStoredUser } from "@/lib/api";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/create/image", label: "Create — Image" },
  { href: "/app/create/video", label: "Create — Video" },
  { href: "/app/create/audio", label: "Create — Audio" },
  { href: "/app/history", label: "Generation history" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/billing", label: "Billing" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("haptags_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // One-time auth gate: server/first client render stay in sync (both
    // render null), so this doesn't cause a hydration mismatch or cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [router]);

  const user = getStoredUser();

  if (!ready) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-[#DCE3EA] bg-white flex flex-col">
        <Link href="/" className="font-serif font-bold text-lg px-5 py-5 border-b border-[#DCE3EA]">
          Haptags
        </Link>
        <nav className="flex-1 flex flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[#EAF1FB] text-[#2A78D6] font-medium"
                    : "text-[#46566A] hover:bg-[#F6F7F8]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#DCE3EA]">
          <p className="text-xs text-[#8A97A6] px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-[#46566A] hover:bg-[#F6F7F8]"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
