"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const currentPage = pathSegments[pathSegments.length - 1] || "Dashboard";

  return (
    <nav
      className={`sticky top-4 z-40 mx-4 flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300 ${
        scrolled
          ? "glass-card"
          : "bg-transparent"
      }`}
    >
      <div>
        <div className="text-sm text-vision-gray-400 capitalize">
          Pages / {currentPage}
        </div>
        <h2 className="text-lg font-bold text-white capitalize mt-1">
          {currentPage}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="hidden md:flex items-center bg-[#0F1535] border border-white/10 rounded-full px-4 py-2">
          <span className="text-vision-gray-400 mr-2">🔍</span>
          <input 
            type="text" 
            placeholder="Type here..." 
            className="bg-transparent text-sm text-white placeholder-vision-gray-400 focus:outline-none w-48"
          />
        </div>

        {/* Action Icons */}
        <button className="text-vision-gray-400 hover:text-white transition-colors">
          ⚙️
        </button>
        <button className="text-vision-gray-400 hover:text-white transition-colors relative">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#EE5D50] rounded-full"></span>
        </button>
        <div style={{ background: 'linear-gradient(135deg, #0075FF 0%, #7756FC 100%)' }} className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border border-white/20">
          A
        </div>
      </div>
    </nav>
  );
}
