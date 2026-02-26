import { LogoZS } from "@/components/brand/logo";
import { Lock } from "lucide-react";

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] space-y-8 text-center">
        <LogoZS className="w-16 h-16 text-[#4880FF] mx-auto" />
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-zinc-100">
          <h2 className="text-2xl font-black mb-2">Nueva Contraseña</h2>
          <p className="text-sm text-zinc-500 mb-8">Ingresa tu nueva clave de acceso.</p>
          
          <form className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input type="password" placeholder="••••••••" required
                  className="w-full pl-12 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 outline-none focus:ring-2 focus:ring-[#4880FF]" />
              </div>
            </div>
            <button className="w-full bg-[#4880FF] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20">
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
