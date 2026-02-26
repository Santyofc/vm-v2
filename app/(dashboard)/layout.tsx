import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1535]">
      {/* Sidebar lateral fijo */}
      <Sidebar />

      {/* Contenedor principal de la aplicación */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden no-scrollbar pb-6 relative">
        <Navbar />
        
        {/* Área de inyección de las páginas (Page Component) */}
        <main className="flex-1 px-4 pt-6 md:px-6">
          {children}
        </main>

        {/* Footer simple (opcional para mantener la simetría) */}
        <footer className="mt-8 px-6 text-center text-sm text-vision-gray-500">
          © {new Date().getFullYear()} ZonaSur Tech. Diseñado con Glassmorphism.
        </footer>
      </div>
    </div>
  );
}
