"use client";

import { useState } from "react";
import { Search, MoreVertical, Edit, Trash, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const tenants = [
  { id: 1, name: "Zona Sur Central", owner: "Santy Delgado", status: "Activo", appointments: 1240, revenue: "$4,200" },
  { id: 2, name: "Sucursal Norte", owner: "Jose Leiva", status: "Activo", appointments: 850, revenue: "$2,800" },
  { id: 3, name: "Punto Express", owner: "Santiago L.", status: "Pendiente", appointments: 0, revenue: "$0" },
  { id: 4, name: "Zona Tech Sur", owner: "Maria Gomez", status: "Suspendido", appointments: 430, revenue: "$1,100" },
];

export function TenantTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda Superior */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vision-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por negocio o dueño..." 
            className="vision-input w-full pl-12"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-brand px-8 whitespace-nowrap">
          + Nuevo Negocio
        </button>
      </div>

      {/* Tabla Glassmorphism */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-vision-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-6">Negocio</th>
                <th className="px-8 py-6">Dueño</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6 text-center">Citas</th>
                <th className="px-8 py-6">Ingresos</th>
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-vision-blue/20 flex items-center justify-center text-vision-blue font-bold">
                        {tenant.name.charAt(0)}
                      </div>
                      <span className="text-white font-bold">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-vision-gray-400 text-sm font-medium">{tenant.owner}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                      tenant.status === "Activo" ? "bg-vision-teal/10 text-vision-teal" : 
                      tenant.status === "Pendiente" ? "bg-amber-500/10 text-amber-500" : "bg-vision-red/10 text-vision-red"
                    )}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-white font-medium">{tenant.appointments}</td>
                  <td className="px-8 py-5 text-vision-teal font-bold">{tenant.revenue}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-vision-gray-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-vision-red/10 rounded-lg text-vision-red">
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-vision-blue/10 rounded-lg text-vision-blue">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
