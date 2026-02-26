"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Building } from "lucide-react";
import Link from "next/link";

/**
 * Legacy register form component.
 * The primary register flow now uses /app/(auth)/register/page.tsx directly.
 * This component is kept for any legacy reference but updated to use zs-* tokens.
 */
export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      window.location.href = "/auth/verify";
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 bg-zs-error/15 text-zs-error rounded-xl text-sm font-bold border border-zs-error/30">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
            <input name="name" type="text" placeholder="Nombre Apellido" required
              className="zs-input pl-11" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
            Nombre del Negocio
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
            <input name="business" type="text" placeholder="Mi Negocio" required
              className="zs-input pl-11" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
          Email Corporativo
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
          <input name="email" type="email" placeholder="contacto@negocio.com" required
            className="zs-input pl-11" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
          <input name="password" type="password" placeholder="••••••••" required
            className="zs-input pl-11" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="zs-btn-primary w-full">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Cuenta de Negocio"}
      </button>

      <p className="text-center text-sm text-zs-text-muted font-medium">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-zs-blue font-bold hover:text-zs-purple transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
