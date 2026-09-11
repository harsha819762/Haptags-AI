"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DISMISS_KEY = "haptags_promo_dismissed_v1";

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One-time client-only read: localStorage isn't available during SSR, so
    // the server and first client render both start hidden (no mismatch),
    // and this effect reveals the banner right after based on the real value.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(window.localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage unavailable — dismissal just won't persist across visits
    }
  }

  return (
    <div className="relative bg-[#E8963C] text-[#1A1204] text-sm">
      <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-center gap-3">
        <span className="font-medium text-center">
          Founding-member pricing — lock in Pro at the launch price before public rollout
        </span>
        <Link
          href="/signup"
          className="hidden sm:inline-block px-3 py-1 rounded-md bg-[#1A1204] text-[#F3F1EC] text-xs font-medium hover:bg-[#2A200C] transition-colors"
        >
          Claim it
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
