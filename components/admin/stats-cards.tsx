import { Users, Briefcase, TrendingUp, AlertCircle } from "lucide-react";

export function DashboardStatsGrid() {
  const stats = [
    { label: "Clientes", val: "1,280", icon: Users, col: "text-blue-600", bg: "bg-blue-100" },
    { label: "Servicios", val: "42", icon: Briefcase, col: "text-amber-600", bg: "bg-amber-100" },
    { label: "Ingresos", val: "2,400", icon: TrendingUp, col: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Alertas", val: "3", icon: AlertCircle, col: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((s, idx) => (
        <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">{s.label}</span>
              <p className="text-4xl font-black tracking-tighter">{s.val}</p>
            </div>
            <div className={`p-5 rounded-[1.8rem] ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.col}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
