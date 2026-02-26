"use client";

import { DisableContextMenu } from "@/components/DisableContextMenu";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zs-bg-primary text-zs-text-primary font-sans selection:bg-zs-blue/20 relative overflow-hidden">
      {/* Background Nebula — sutil, mezcla con brand dark */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/cinematic_nebula_bg.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-10 mix-blend-screen"
        />
      </div>

      {/* Security protection */}
      <DisableContextMenu />

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
