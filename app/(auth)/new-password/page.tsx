import { LogoZS } from "@/components/brand/logo";
import { Lock } from "lucide-react";

export default function NewPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo + Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4 animate-float">
          <LogoZS className="w-14 h-14 text-zs-blue" />
        </div>
        <h2 className="text-2xl font-bold text-zs-text-primary tracking-tight">
          Nueva Contraseña
        </h2>
        <p className="text-zs-text-muted text-sm mt-1">
          Ingresa tu nueva clave de acceso.
        </p>
      </div>

      {/* Card glassmorphism */}
      <div className="glowing-box">
        <div className="glowing-content">
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="zs-input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zs-text-secondary uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zs-text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="zs-input pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              className="zs-btn-primary w-full mt-2"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
