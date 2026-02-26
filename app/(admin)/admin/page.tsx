export const dynamic = "force-dynamic";
import { DashboardStatsGrid } from "@/components/admin/stats-cards";
import { VisionSalesChart } from "@/components/admin/vision-charts";
import { ArrowUpRight, Plus } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-10 animate-cascade">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Consola Central</h1>
          <p className="text-vision-gray-400 mt-1 font-medium">Bienvenido, Santy. Infraestructura al 100%.</p>
        </div>
        <button className="vision-btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl bg-vision-brand text-sm font-bold shadow-vision-glass hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Nuevo Reporte
        </button>
      </header>

      {/* Grid de Stats con Glow */}
      <DashboardStatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 vision-card p-1">
           <VisionSalesChart />
        </div>

        <div className="vision-card p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-vision-blue/20 rounded-2xl flex items-center justify-center mb-6">
              <ArrowUpRight className="text-vision-blue w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Crecimiento Mensual</h3>
            <p className="text-vision-gray-400 text-sm leading-relaxed">
              El volumen de citas en **Zona Sur Tech** ha subido un 20% tras la implementación de la V2.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-2xl font-black">
            + $2,400.00
          </div>
        </div>
      </div>
    </div>
  );
}
