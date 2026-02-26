import React from "react";
import Link from "next/link";
import { CalendarCheck, Mail, CreditCard } from "lucide-react";
import { AnimatedSection, AnimatedStaggerItem, AnimatedButton } from "@/components/landing/Animators";
import { VisionCard } from "@/components/ui/VisionCard";

export const metadata = {
  title: "ZonaSur Tech | Gestión Inteligente de Citas",
  description: "Plataforma todo-en-uno para clínicas, salones y consultorios.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zs-bg-primary relative overflow-hidden flex flex-col">

      {/* ── Faint grid overlay ── */}
      <div className="absolute inset-0 zs-grid-bg pointer-events-none" />

      {/* ── Background orbs ── */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-zs-purple/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-zs-blue/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-zs-teal/8 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Public Navbar ── */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zs-blue to-zs-purple flex items-center justify-center shadow-zs-glow-blue">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M55 55H145L55 145H145" stroke="white" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-zs-text-primary">
            ZonaSur <span className="text-zs-blue">Tech</span>
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href="/login"
            className="text-zs-text-secondary hover:text-zs-text-primary transition-colors px-4 py-2 text-sm font-semibold"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="zs-btn-primary text-sm px-5 py-2.5"
          >
            Empezar Gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center mt-8 mb-24">
        <AnimatedSection delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zs-blue/10 border border-zs-blue/20 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-zs-teal animate-pulse" />
            <span className="text-xs font-bold text-zs-text-secondary uppercase tracking-widest">
              La plataforma definitiva para tu negocio
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-zs-text-primary max-w-4xl leading-tight tracking-tight">
            Ahorra horas de gestión y{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-blue to-zs-purple">
              automatiza tus citas.
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <p className="mt-8 text-lg md:text-xl text-zs-text-secondary max-w-2xl leading-relaxed">
            El sistema todo-en-uno diseñado con tecnología de punta. Elimina el papeleo,
            fideliza a tus clientes y enfócate en lo que mejor sabes hacer.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <AnimatedButton
              href="/register"
              className="zs-btn-primary text-lg px-8 py-4"
            >
              Crear mi cuenta <span>→</span>
            </AnimatedButton>
            <AnimatedButton
              href="/login"
              className="zs-btn-secondary text-lg px-8 py-4"
            >
              Acceso Clientes
            </AnimatedButton>
          </div>
        </AnimatedSection>

        {/* Stats row */}
        <AnimatedSection delay={0.55}>
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: "24/7", label: "Disponibilidad" },
              { value: "∞", label: "Citas por mes" },
              { value: "100%", label: "Multi-tenant" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zs-blue to-zs-purple">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-zs-text-muted uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </main>

      {/* ── Features Section ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedStaggerItem index={0}>
            <VisionCard className="h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zs-blue to-blue-600 flex items-center justify-center shadow-zs-glow-blue mb-6">
                <CalendarCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zs-text-primary mb-3">Agenda Inteligente</h3>
              <p className="text-zs-text-secondary text-sm leading-relaxed">
                Calendario sincronizado en tiempo real. Evita conflictos de horarios y
                permite a tus clientes reservar 24/7.
              </p>
            </VisionCard>
          </AnimatedStaggerItem>

          <AnimatedStaggerItem index={1}>
            <VisionCard className="h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zs-purple to-purple-600 flex items-center justify-center shadow-zs-glow-purple mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zs-text-primary mb-3">Recordatorios Auto</h3>
              <p className="text-zs-text-secondary text-sm leading-relaxed">
                Reduce las inasistencias drásticamente enviando recordatorios automáticos
                por correo a tus clientes.
              </p>
            </VisionCard>
          </AnimatedStaggerItem>

          <AnimatedStaggerItem index={2}>
            <VisionCard className="h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zs-teal to-teal-600 flex items-center justify-center mb-6"
                   style={{ boxShadow: '0 0 20px rgba(1,181,116,0.3)' }}>
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zs-text-primary mb-3">Pagos Integrados</h3>
              <p className="text-zs-text-secondary text-sm leading-relaxed">
                Suscripciones y cobros gestionados de forma segura con Stripe. Tu dinero
                directo a tu cuenta sin fricción.
              </p>
            </VisionCard>
          </AnimatedStaggerItem>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zs-border bg-black/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zs-text-muted text-sm">
            © {new Date().getFullYear()} ZonaSur Tech. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-zs-text-muted">
            <Link href="/terminos" className="hover:text-zs-text-secondary transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-zs-text-secondary transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
