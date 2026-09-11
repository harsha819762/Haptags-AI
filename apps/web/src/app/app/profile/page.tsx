"use client";

import { getStoredUser } from "@/lib/api";

export default function ProfilePage() {
  const user = getStoredUser();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif font-bold text-2xl mb-1">Profile</h1>
      <p className="text-[#46566A] text-sm mb-8">Your account details.</p>

      <div className="border border-[#DCE3EA] rounded-lg bg-white divide-y divide-[#DCE3EA]">
        <div className="px-5 py-4 flex items-center justify-between text-sm">
          <span className="text-[#8A97A6] font-mono text-xs uppercase tracking-wider">Email</span>
          <span className="font-medium">{user?.email ?? "—"}</span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between text-sm">
          <span className="text-[#8A97A6] font-mono text-xs uppercase tracking-wider">
            Organization
          </span>
          <span className="font-medium">{user?.organizationName ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
