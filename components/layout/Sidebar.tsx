"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const NAVIGATION = [
  { name: "Dashboard", href: "/tenant/dashboard", icon: "📊" },
  { name: "Appointments", href: "/tenant/appointments", icon: "📅" },
  { name: "Clients", href: "/tenant/clients", icon: "👥" },
  { name: "Billing", href: "/tenant/billing", icon: "💳" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-vision-brand text-white shadow-vision-glass"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 max-w-full transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          "bg-vision-main lg:bg-transparent lg:bg-vision-glass backdrop-blur-2xl border-r border-white/10 lg:border-none",
          "m-0 lg:m-4 lg:rounded-2xl shadow-vision-glass",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-center py-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">
              ZonaSur <span className="text-vision-blue">Tech</span>
            </h1>
          </div>

          <nav className="flex-1 mt-6 space-y-2 no-scrollbar overflow-y-auto">
            {NAVIGATION.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-vision-active text-white shadow-md border border-white/5" 
                      : "text-vision-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg",
                    isActive ? "bg-vision-brand text-white" : "bg-white/10"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
