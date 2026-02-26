import { getDashboardMetrics, getUpcomingAppointments } from "@/actions/tenant";
import { formatTime, formatCurrency } from "@/lib/utils";
import { auth } from "@/auth";
import Link from "next/link";

export default async function TenantDashboard() {
  const session = await auth();
  const tenantId = (session?.user as any)?.tenantId;

  // PROTECCIÓN: Si es Superadmin y no tiene negocio asignado
  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">👑</div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Modo SuperAdmin</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-md text-lg">
          Estás navegando con la cuenta maestra. Para ver métricas, debes seleccionar un negocio específico o ir al panel global.
        </p>
        <Link 
          href="https://admin.zonasurtech.online"
          className="mt-8 px-6 py-3 bg-[#45f3ff] text-black font-bold rounded-xl hover:shadow-[0_0_20px_#45f3ff] transition-all duration-300 transform hover:scale-105"
        >
          Ir al Panel de Administración
        </Link>
      </div>
    );
  }

  try {
    const metrics = await getDashboardMetrics();
    const appointments = await getUpcomingAppointments();
    
    return (
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Resumen del Negocio</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Métricas en tiempo real para tu sucursal.</p> 
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CardMetric title="Citas Hoy" value={metrics?.todayAppointments || 0} icon="📅" />
          <CardMetric title="Ingresos" value={formatCurrency(metrics?.monthlyRevenue || 0)} icon="💰" />
          <CardMetric title="Asistencia" value={`${metrics?.attendanceRate || 0}%`} icon="📊" />
          <CardMetric title="Top Servicio" value={metrics?.topService || "N/A"} icon="⭐" />
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold">Próximas Citas</h3>
          </div>
          {appointments && appointments.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {appointments.map((appt: any) => (
                <div key={appt.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <p className="text-sm font-medium">{appt.client.name}</p>
                  <p className="text-sm text-zinc-500">{formatTime(appt.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">Sin citas programadas.</div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-8 text-red-500">Error de conexión con la base de datos.</div>;
  }
}

function CardMetric({ title, value, icon }: { title: string, value: string | number, icon: string }) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
