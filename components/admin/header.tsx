"use client";

import { Search, Bell, Settings, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full p-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Breadcrumbs / Path Indicator */}
      <div className="flex flex-col">
        <p className="text-vision-gray-400 text-xs font-medium">Páginas / Dashboard</p>
        <h2 className="text-white font-bold text-lg tracking-tight">Consola Principal</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar con Vision Glass */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar en el sistema..." 
            className="w-full pl-12 pr-4 py-2 bg-vision-main/50 border border-white/10 rounded-2xl text-sm focus:border-vision-blue outline-none transition-all placeholder:text-vision-gray-500"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-vision-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-vision-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Selector - Vision UI Style */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white truncate max-w-[120px]">
              {session?.user?.name || "Santy Delgado"}
            </p>
            <p className="text-[10px] text-vision-blue font-black uppercase tracking-widest">
              {(session?.user as any)?.role || "SUPERADMIN"}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-vision-active p-1 pr-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
            <div className="w-8 h-8 rounded-xl bg-vision-brand flex items-center justify-center text-xs font-bold text-white shadow-vision-glass">
              {session?.user?.name?.charAt(0) || "S"}
            </div>
            <ChevronDown className="w-4 h-4 text-vision-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
