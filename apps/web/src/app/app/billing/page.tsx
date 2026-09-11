"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const PLANS = [
  { name: "Free", price: "₹0", credits: "100 credits / month" },
  { name: "Pro", price: "₹1,499/mo", credits: "2,000 credits / month" },
  { name: "Creator", price: "₹4,999/mo", credits: "8,000 credits / month" },
  { name: "Team", price: "Custom", credits: "Pooled credits, seats, brand kit" },
];

export default function BillingPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getCredits>> | null>(null);

  useEffect(() => {
    api.getCredits().then(setData);
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif font-bold text-2xl mb-1">Billing</h1>
      <p className="text-[#46566A] text-sm mb-8">Credits are debited only when a generation completes.</p>

      <div className="border border-[#DCE3EA] rounded-lg p-5 bg-white mb-8 flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-[#8A97A6] mb-1">
            Current balance
          </div>
          <div className="font-serif font-bold text-3xl">
            {data ? data.balance : "…"} <span className="text-base font-sans font-normal text-[#8A97A6]">credits</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-md bg-[#2A78D6] text-white font-medium hover:bg-[#1E5AA8] transition-colors">
          Top up
        </button>
      </div>

      <h2 className="font-serif font-bold text-lg mb-3">Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        {PLANS.map((p) => (
          <div key={p.name} className="border border-[#DCE3EA] rounded-lg p-4 bg-white">
            <div className="font-medium mb-1">{p.name}</div>
            <div className="font-serif font-bold text-lg mb-1">{p.price}</div>
            <div className="text-xs text-[#8A97A6]">{p.credits}</div>
          </div>
        ))}
      </div>

      <h2 className="font-serif font-bold text-lg mb-3">Ledger</h2>
      {!data ? (
        <p className="text-sm text-[#8A97A6]">Loading…</p>
      ) : data.ledger.length === 0 ? (
        <p className="text-sm text-[#8A97A6]">No credit activity yet.</p>
      ) : (
        <div className="border border-[#DCE3EA] rounded-lg bg-white divide-y divide-[#DCE3EA]">
          {data.ledger.map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-[#46566A]">{entry.reason}</span>
              <span className={`font-mono tabular-nums ${entry.delta < 0 ? "text-[#D03B3B]" : "text-[#0CA30C]"}`}>
                {entry.delta > 0 ? "+" : ""}
                {entry.delta}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
