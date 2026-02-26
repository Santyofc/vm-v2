export const dynamic = "force-dynamic";
import { getSystemMetrics } from "@/actions/monitoring";
import { PerformanceChart } from "@/components/admin/monitoring-charts";
import { Activity, Database, Cpu, HardDrive } from "lucide-react";

export const dynamic = "force-dynamic"; // Para que siempre pida datos frescos

export default async function MonitoringPage() {
  const metrics = await getSystemMetrics();

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
        <p className="text-zinc-500">Estado de la infraestructura de Zona Sur Tech en tiempo real.</p>
      </div>

      {/* Grid de Stats Rápidos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="CPU Load" value={`${metrics.hardware.cpuLoad}%`} icon={<Cpu className="text-[#45f3ff]" />} />
        <MetricCard title="RAM Usage" value={`${metrics.hardware.memory}%`} icon={<Activity className="text-purple-500" />} />
        <MetricCard title="DB Latency" value={`${metrics.database.latency}ms`} icon={<Database className="text-emerald-500" />} />
        <MetricCard title="Server Uptime" value={`${metrics.hardware.uptime}h`} icon={<HardDrive className="text-orange-500" />} />
      </div>

      {/* Gráfico Principal */}
      <div className="p-8 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-6">Carga del Servidor (Últimos 10 min)</h3>
        <PerformanceChart data={metrics.history} />
      </div>

      {/* Detalles de la Base de Datos */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40">
          <h4 className="text-zinc-400 text-sm font-medium mb-4">Negocios Registrados</h4>
          <p className="text-4xl font-bold">{metrics.database.tenants}</p>
        </div>
        <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40">
          <h4 className="text-zinc-400 text-sm font-medium mb-4">Citas Procesadas</h4>
          <p className="text-4xl font-bold">{metrics.database.appointments}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-zinc-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-zinc-800/50 rounded-2xl">{icon}</div>
    </div>
  );
}
