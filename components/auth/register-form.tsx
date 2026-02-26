"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Building } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Aquí llamarías a tu Server Action de registro (ej: registerAction)
    // Por ahora simulamos el flujo
    setTimeout(() => {
      setLoading(false);
      // Redirigir a verificación
      window.location.href = "/auth/verify";
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-600">Nombre Completo</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input name="name" type="text" placeholder="Santy Delgado" required
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-[#4880FF] outline-none transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-600">Nombre del Negocio</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input name="business" type="text" placeholder="Zona Sur Sucursal" required
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-[#4880FF] outline-none transition-all" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-600">Email Corporativo</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input name="email" type="email" placeholder="contacto@negocio.com" required
            className="w-full pl-12 pr-4 py-4 bg-zinc-50 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-[#4880FF] outline-none transition-all" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-600">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input name="password" type="password" placeholder="••••••••" required
            className="w-full pl-12 pr-4 py-4 bg-zinc-50 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-[#4880FF] outline-none transition-all" />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#4880FF] text-white font-bold py-4 rounded-2xl hover:bg-[#3666d6] shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Cuenta de Negocio"}
      </button>

      <p className="text-center text-sm text-zinc-500 font-medium">
        ¿Ya tienes cuenta? <Link href="/login" className="text-[#4880FF] font-bold hover:underline">Inicia sesión</Link>
      </p>
    </form>
  );
}
