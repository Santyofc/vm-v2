export const dynamic = "force-dynamic";
import { TenantTable } from "@/components/admin/tenant-table";

export default function NegociosAdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter">
          Gestión de Negocios
        </h1>
        <p className="text-vision-gray-400 max-w-2xl">
          Administra las sucursales y tenants de Zona Sur Tech. Controla el estado de las cuentas y monitorea el rendimiento individual.
        </p>
      </div>

      {/* Contenedor de la tabla con animación de entrada */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TenantTable />
      </div>
    </div>
  );
}
