"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, ChevronLeft, LogOut, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Negocios", icon: Briefcase, href: "/admin/negocios" },
    { label: "Database", icon: Database, href: "/admin/database" },
  ];

  return (
    <aside className={cn(
      "h-screen vision-card !rounded-none !border-y-0 !border-l-0 transition-all duration-300 relative z-50",
      isCollapsed ? "w-24" : "w-72"
    )}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-12 bg-vision-blue text-white p-1 rounded-full border-4 border-vision-main">
        <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
      </button>

      <div className="p-8 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-vision-blue rounded-xl shrink-0" />
        {!isCollapsed && <span className="font-black text-xl tracking-tighter italic">ZONA SUR</span>}
      </div>

      <nav className="px-4 space-y-2">
        {menu.map((item) => (
          <Link key={item.href} href={item.href} className={cn(
            "flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm",
            pathname === item.href ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:bg-white/5"
          )}>
            <item.icon className={cn("w-6 h-6", pathname === item.href ? "text-vision-blue" : "text-zinc-500")} />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 w-full px-4">
        <button onClick={() => signOut()} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all">
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
