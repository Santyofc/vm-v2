import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Verificando tu correo... | ZonaSur Tech",
};

interface VerifyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  // En Next.js 15, searchParams es una promesa
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vision-main p-4">
        <div className="bg-vision-glass backdrop-blur-xl border border-white/10 p-8 rounded-[20px] max-w-md w-full text-center shadow-vision-glass">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ×
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Token Inválido</h1>
          <p className="text-vision-gray-400 mb-6">El enlace de verificación es incorrecto o no existe.</p>
          <Link href="/login" className="inline-block bg-vision-brand text-white px-6 py-2.5 rounded-xl font-bold w-full">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verification_token: token },
    });

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-vision-main p-4">
          <div className="bg-vision-glass backdrop-blur-xl border border-white/10 p-8 rounded-[20px] max-w-md w-full text-center shadow-vision-glass">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ×
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Enlace expirado o usado</h1>
            <p className="text-vision-gray-400 mb-6">Este enlace de verificación ya fue utilizado o ha expirado.</p>
            <Link href="/login" className="inline-block bg-vision-brand text-white px-6 py-2.5 rounded-xl font-bold w-full">
              Ir al Login
            </Link>
          </div>
        </div>
      );
    }

    if (user.token_expires_at && user.token_expires_at < new Date()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-vision-main p-4">
          <div className="bg-vision-glass backdrop-blur-xl border border-white/10 p-8 rounded-[20px] max-w-md w-full text-center shadow-vision-glass">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ×
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Enlace expirado</h1>
            <p className="text-vision-gray-400 mb-6">Tu enlace de verificación ha caducado. Por favor, solicita uno nuevo.</p>
            <Link href="/login" className="inline-block bg-vision-brand text-white px-6 py-2.5 rounded-xl font-bold w-full">
              Ir al Login
            </Link>
          </div>
        </div>
      );
    }

    // El token es válido, verificar usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        emailVerified: new Date(),
        verification_token: null, // Invalidar token
        token_expires_at: null,
      },
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-vision-main p-4">
        <div className="bg-vision-glass backdrop-blur-xl border border-white/10 p-8 rounded-[20px] max-w-md w-full text-center shadow-vision-glass">
          <div className="w-16 h-16 bg-teal-400/10 text-teal-400 border border-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">¡Cuenta verificada!</h1>
          <p className="text-vision-gray-400 mb-6">Tu dirección de correo ha sido confirmada correctamente.</p>
          <Link href="/login" className="inline-block bg-vision-brand text-white px-6 py-2.5 rounded-xl font-bold w-full shadow-vision-glass hover:opacity-90 transition-opacity">
            Ingresar a tu Cuenta
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-vision-main p-4">
        <div className="bg-vision-glass backdrop-blur-xl border border-white/10 p-8 rounded-[20px] max-w-md w-full text-center shadow-vision-glass">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ⚠
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error del Servidor</h1>
          <p className="text-vision-gray-400 mb-6">Ocurrió un error inesperado al verificar tu cuenta. Intenta de nuevo.</p>
          <Link href="/login" className="inline-block bg-vision-brand text-white px-6 py-2.5 rounded-xl font-bold w-full shadow-vision-glass hover:opacity-90 transition-opacity">
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }
}
