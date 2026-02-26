import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { LogoZS } from "@/components/brand/logo";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  // Si ya hay sesión, redirigir según rol
  if (session?.user) {
    const userRole = (session.user as { role?: string }).role;

    if (userRole === "SUPERADMIN") {
      redirect("https://admin.zonasurtech.online");
    }

    redirect("https://cita.zonasurtech.online");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo + Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4 animate-float">
          <LogoZS className="w-14 h-14 text-zs-blue" />
        </div>
        <h1 className="text-2xl font-bold text-zs-text-primary tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="text-zs-text-muted text-sm mt-1">
          Identifícate para continuar a tu panel
        </p>
      </div>

      {/* Card glassmorphism */}
      <div className="glowing-box">
        <div className="glowing-content">
          <Suspense fallback={
            <div className="text-zs-text-secondary text-sm text-center py-8">
              Cargando formulario...
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>

      {/* Link registro */}
      <p className="text-center text-sm text-zs-text-muted mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-zs-blue font-semibold hover:text-zs-purple transition-colors">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
