import React from "react";
import { VisionCard } from "@/components/ui/VisionCard";
// import { getTenantConfig } from "@/actions/tenant"; // Descomentar al integrar con tu backend real

export const metadata = {
  title: "Configuración | ZonaSur Tech",
};

export default async function SettingsPage() {
  // Mock de configuración (reemplazar con await getTenantConfig())
  const config = {
    name: "Spa Elite",
    slug: "spa-elite",
    subdomain: "cita.zonasurtech.online/tenant/spa-elite",
    plan: "PRO",
    status: "active" as const,
    renewalDate: "2026-03-25",
  };

  const inputStyles = "w-full bg-[#0F1535]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-vision-gray-500 focus:outline-none focus:border-vision-blue focus:ring-1 focus:ring-vision-blue transition-all";
  const labelStyles = "block text-xs font-bold text-vision-gray-400 uppercase tracking-wider mb-2";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Configuración del Negocio</h2>
        <p className="text-sm text-vision-gray-400 mt-1">Gestiona el perfil de tu tenant y tu suscripción activa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Formularios (Ocupa 2 de 3 fracciones en desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <VisionCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-vision-brand flex items-center justify-center text-white shadow-vision-glass">
                🏢
              </div>
              <h3 className="text-lg font-bold text-white">Perfil General</h3>
            </div>
            
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelStyles}>Nombre del Negocio</label>
                  <input 
                    type="text" 
                    defaultValue={config.name} 
                    className={inputStyles} 
                    placeholder="Ej. Spa Elite"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Identificador (Slug)</label>
                  <input 
                    type="text" 
                    defaultValue={config.slug} 
                    disabled 
                    className={`${inputStyles} opacity-60 cursor-not-allowed`} 
                  />
                </div>
              </div>

              <div>
                <label className={labelStyles}>URL de Acceso a Clientes</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-white/5 text-vision-gray-400 text-sm">
                    https://
                  </span>
                  <input 
                    type="text" 
                    defaultValue={config.subdomain.replace('https://', '')} 
                    disabled 
                    className={`${inputStyles} rounded-l-none opacity-60 cursor-not-allowed`} 
                  />
                </div>
                <p className="text-xs text-vision-gray-500 mt-2">Esta URL es generada automáticamente y no puede cambiarse.</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button 
                  type="button" 
                  className="bg-vision-brand hover:opacity-90 transition-opacity text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-vision-glass"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </VisionCard>

          <VisionCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vision-teal to-blue-500 flex items-center justify-center text-white shadow-vision-glass">
                🔔
              </div>
              <h3 className="text-lg font-bold text-white">Notificaciones</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                <div>
                  <h4 className="text-sm font-bold text-white">Recordatorios de Citas</h4>
                  <p className="text-xs text-vision-gray-400 mt-1">Enviar email al cliente 24h antes.</p>
                </div>
                {/* Toggle Switch (Tailwind CSS puro) */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vision-blue"></div>
                </label>
              </div>
            </div>
          </VisionCard>
        </div>

        {/* Columna Derecha: Facturación y Suscripción */}
        <div className="flex flex-col gap-6">
          <VisionCard className="relative overflow-hidden">
            {/* Decoración de fondo para destacar la tarjeta de pago */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-vision-purple blur-3xl opacity-20 rounded-full pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-white mb-6 relative z-10">Suscripción Actual</h3>
            
            <div className="flex flex-col items-center p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-teal-400 border border-teal-400/20 mb-4 uppercase tracking-widest bg-teal-400/10">
                {config.status === "active" ? "Activa" : "Inactiva"}
              </span>
              
              <h4 className="text-3xl font-bold text-white mb-1">{config.plan}</h4>
              <p className="text-sm text-vision-gray-400 mb-6">Plan seleccionado</p>
              
              <div className="w-full h-px bg-white/10 mb-6"></div>
              
              <div className="w-full flex justify-between items-center text-sm mb-2">
                <span className="text-vision-gray-400">Próximo cobro</span>
                <span className="text-white font-bold">{config.renewalDate}</span>
              </div>
            </div>

            <button 
              className="mt-6 w-full py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 relative z-10"
            >
              <span>💳</span> Gestionar en Stripe
            </button>
            <p className="text-xs text-center text-vision-gray-500 mt-3 relative z-10">
              Redirige al portal seguro de cliente.
            </p>
          </VisionCard>
        </div>
      </div>
    </div>
  );
}
