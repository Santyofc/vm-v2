// app/verify/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// En Next.js 15/16, searchParams es asíncrono.
export default async function VerifyPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600">Error de verificación</h1>
          <p className="mt-2 text-gray-600">No se proporcionó un token válido en la URL.</p>
        </div>
      </div>
    );
  }

  try {
    // 1. Buscar el token en la tabla correcta
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-red-600">Token Inválido</h1>
            <p className="mt-2 text-gray-600">El enlace de verificación no existe o ya fue utilizado.</p>
            <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
              Volver al login
            </Link>
          </div>
        </div>
      );
    }

    // 2. Verificar si el token expiró
    if (verificationToken.expires < new Date()) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-red-600">Token Expirado</h1>
            <p className="mt-2 text-gray-600">El tiempo para verificar ha expirado. Solicita un nuevo enlace.</p>
          </div>
        </div>
      );
    }

    // 3. Buscar el usuario usando el identifier (email)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-red-600">Usuario no encontrado</h1>
            <p className="mt-2 text-gray-600">La cuenta asociada a este enlace ya no existe.</p>
          </div>
        </div>
      );
    }

    // 4. Actualizar usuario y eliminar token (solo si no estaba ya verificado)
    if (!user.emailVerified) {
      // Uso $transaction para evitar inconsistencias de datos si falla la eliminación del token
      await prisma.$transaction([
        prisma.user.update({
          where: { email: user.email },
          data: { emailVerified: new Date() },
        }),
        prisma.verificationToken.delete({
          where: { token },
        }),
      ]);
    }

    // Renderizado de éxito
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta verificada!</h1>
          <p className="text-gray-600 mb-6">Tu correo electrónico ha sido verificado correctamente.</p>
          <Link 
            href="/login" 
            className="w-full inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Continuar al inicio de sesión
          </Link>
        </div>
      </div>
    );

  } catch (error) {
    console.error("Error en página de verificación:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600">Error de servidor</h1>
          <p className="mt-2 text-gray-600">Ocurrió un problema inesperado al verificar la cuenta.</p>
        </div>
      </div>
    );
  }
}
