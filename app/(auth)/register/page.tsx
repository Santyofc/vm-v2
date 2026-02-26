"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, Building, User, Mail, Lock } from "lucide-react";
import { LogoZS } from "@/components/brand/logo";

function getDefaultTargetByRole(role: string | undefined) {
  const isLocalhost = window.location.hostname === "localhost";

  if (role === "SUPERADMIN") {
    return isLocalhost
      ? "http://admin.localhost:3000"
      : "https://admin.zonasurtech.online";
  }

  return isLocalhost
    ? "http://cita.localhost:3000"
    : "https://cita.zonasurtech.online";
}

export default function RegisterPage() {
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          businessName,
        }),
      });

      const data = (await registerRes.json()) as { message?: string };

      if (!registerRes.ok) {
        throw new Error(data.message || "Error al registrarse.");
      }

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/",
      });

      if (loginRes?.error) {
        throw new Error("Cuenta creada, pero no se pudo iniciar sesión automáticamente.");
      }

      if (loginRes?.url) {
        window.location.href = loginRes.url;
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = (await sessionRes.json()) as {
        user?: { role?: string };
      };

      window.location.href = getDefaultTargetByRole(sessionData?.user?.role);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Ha ocurrido un error inesperado.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo + Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4 animate-float">
          <LogoZS className="w-14 h-14 text-zs-blue" />
        </div>
        <h1 className="text-2xl font-bold text-zs-text-primary tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-zs-text-muted text-sm mt-1">
          Únete a ZonaSur Tech y digitaliza tu negocio
        </p>
      </div>

      {/* Card glassmorphism */}
      <div className="glowing-box">
        <div className="glowing-content">
          {/* OAuth buttons (disabled/próximamente) */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm font-medium text-zs-text-secondary opacity-50 cursor-not-allowed"
            >
              <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold inline-flex items-center justify-center">G</span>
              <span>Continuar con Google</span>
              <span className="text-xs text-zs-text-muted">Próximamente</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl text-sm font-medium text-zs-text-primary transition-colors duration-200"
            >
              Continuar con GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 py-0.5 text-zs-text-muted uppercase tracking-widest"
                    style={{ background: "rgba(8,12,35,0.97)" }}>
                o con email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 text-sm text-zs-error border border-zs-error/20 rounded-xl bg-zs-error/10 text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="zs-input pl-11"
                placeholder="Nombre de tu Negocio (Ej: Barber Shop 99)"
              />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="zs-input pl-11"
                placeholder="Tu Nombre y Apellido"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="zs-input pl-11"
                placeholder="hola@tunegocio.com"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="zs-input pl-11"
                placeholder="Contraseña (mín. 8 caracteres)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="zs-btn-primary w-full mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creando Entorno..." : "Comenzar Gestión Gratis"}
            </button>
          </form>

          <p className="text-center text-xs text-zs-text-muted mt-5">
            Al registrarte, aceptas nuestros{" "}
            <Link href="/terminos" className="text-zs-text-secondary hover:text-zs-text-primary underline underline-offset-4 transition-colors">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="/privacidad" className="text-zs-text-secondary hover:text-zs-text-primary underline underline-offset-4 transition-colors">
              Privacidad
            </Link>.
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-zs-text-muted mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-zs-blue font-semibold hover:text-zs-purple transition-colors">
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
}
