import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation"; // Importante para el salto automático
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  // Si ya hay sesión, mandarlo directamente según su rol
  if (session?.user) {
    const userRole = (session.user as any).role;
    
    // Si es SUPERADMIN, lo mandamos al subdominio de administración directamente
    if (userRole === "SUPERADMIN") {
      redirect("https://admin.zonasurtech.online");
    }
    
    // Para otros roles, al subdominio de citas
    redirect("https://cita.zonasurtech.online");
  }

  // Si no hay sesión, mostramos el formulario
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-white text-3xl font-bold">Zona Sur Tech</h1>
          <p className="text-zinc-500 mt-2 text-sm">Identifícate para continuar</p>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] shadow-xl">
          <Suspense fallback={<div className="text-white">Cargando formulario...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
