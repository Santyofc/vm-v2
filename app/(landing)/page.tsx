import React from "react";
import Link from "next/link";
import { VisionCard } from "@/components/ui/VisionCard";

export const metadata = {
  title: "ZonaSur Tech | Gestión Inteligente de Citas",
  description: "Plataforma todo-en-uno para clínicas, salones y consultorios.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vision-main relative overflow-hidden flex flex-col">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vision-purple/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vision-blue/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Public Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-widest text-white uppercase">
          ZonaSur <span className="text-vision-blue">Tech</span>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="text-white hover:text-vision-blue transition-colors px-4 py-2 text-sm font-bold"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="bg-vision-brand hover:opacity-90 transition-opacity text-white px-6 py-2 rounded-xl font-bold text-sm shadow-vision-glass border border-white/10"
          >
            Empezar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center mt-20 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-vision-teal animate-pulse"></span>
          <span className="text-xs font-bold text-vision-gray-400 uppercase tracking-wider">La plataforma definitiva para tu negocio</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white max-w-4xl leading-tight tracking-tight">
          Ahorra horas de gestión y <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vision-blue to-vision-purple">
            automatiza tus citas.
          </span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-vision-gray-400 max-w-2xl">
          El sistema todo-en-uno diseñado con tecnología de punta. Elimina el papeleo, fideliza a tus clientes y enfócate en lo que mejor sabes hacer.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/register" 
            className="bg-vision-brand hover:opacity-90 transition-opacity text-white px-8 py-4 rounded-xl font-bold text-lg shadow-vision-glass border border-white/10 flex items-center justify-center gap-2"
          >
            Crear mi cuenta <span>→</span>
          </Link>
          <Link 
            href="/login" 
            className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center"
          >
            Acceso Clientes
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <VisionCard className="transition-transform duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vision-blue to-blue-600 flex items-center justify-center text-2xl shadow-vision-glass mb-6">
              📅
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Agenda Inteligente</h3>
            <p className="text-vision-gray-400 text-sm leading-relaxed">
              Calendario sincronizado en tiempo real. Evita conflictos de horarios y permite a tus clientes reservar 24/7.
            </p>
          </VisionCard>

          <VisionCard className="transition-transform duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vision-purple to-purple-600 flex items-center justify-center text-2xl shadow-vision-glass mb-6">
              ✉️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Recordatorios Auto</h3>
            <p className="text-vision-gray-400 text-sm leading-relaxed">
              Reduce las inasistencias drásticamente enviando recordatorios automáticos por correo a tus clientes.
            </p>
          </VisionCard>

          <VisionCard className="transition-transform duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vision-teal to-teal-600 flex items-center justify-center text-2xl shadow-vision-glass mb-6">
              💳
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pagos Integrados</h3>
            <p className="text-vision-gray-400 text-sm leading-relaxed">
              Suscripciones y cobros gestionados de forma segura con Stripe. Tu dinero directo a tu cuenta sin fricción.
            </p>
          </VisionCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-vision-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ZonaSur Tech. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
