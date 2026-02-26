"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Credenciales no válidas. Verifica tus datos.");
      setLoading(false);
    } else {
      router.refresh();
      window.location.href = "/login";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-zs-error/15 border border-zs-error/30 text-zs-error text-sm font-semibold animate-in fade-in zoom-in">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
          <input
            name="email"
            type="email"
            placeholder="Email corporativo"
            required
            className="zs-input pl-11"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="zs-input pl-11"
          />
        </div>
      </div>

      {/* Forgot link */}
      <div className="flex justify-end">
        <Link
          href="/auth/recuperar"
          className="text-xs text-zs-text-muted hover:text-zs-blue transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="zs-btn-primary w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Iniciar Sesión"}
      </button>
    </form>
  );
}
