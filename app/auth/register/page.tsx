import { LogoZS } from "@/components/brand/logo";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[640px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <LogoZS className="w-16 h-16 text-[#4880FF] mb-4" />
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Únete a Zona Sur Tech</h1>
          <p className="text-zinc-500 max-w-sm">Comienza a gestionar tus citas y servicios hoy mismo.</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100 dark:border-zinc-800">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
