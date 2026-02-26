"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";

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
      setError("Credenciales no válidas.");
      setLoading(false);
    } else {
      router.refresh();
      window.location.href = "/login"; 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-vision-red/20 border border-vision-red/30 text-vision-red text-sm font-bold animate-in fade-in zoom-in">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-gray-400" />
          <input name="email" type="email" placeholder="Email corporativo" required className="vision-input w-full pl-12" />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-gray-400" />
          <input name="password" type="password" placeholder="Contraseña" required className="vision-input w-full pl-12" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-brand w-full">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
      </button>
    </form>
  );
}
