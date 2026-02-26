"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { LogoZS } from "@/components/brand/logo";

function RecuperarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasResetToken = Boolean(token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const cardTitle = useMemo(() => {
    if (isSuccess && hasResetToken) return "Contraseña actualizada";
    if (isSuccess) return "Revisa tu bandeja";
    if (hasResetToken) return "Crear nueva contraseña";
    return "Recuperar acceso";
  }, [hasResetToken, isSuccess]);

  const handleSendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "Error al solicitar la recuperación.");
      setIsSuccess(true);
      setSuccessMessage(
        `Si ${email} está registrado, recibirás un enlace para restablecer tu contraseña.`
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Error al solicitar la recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Token inválido.");
      if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
      if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar la contraseña.");
      setIsSuccess(true);
      setSuccessMessage("Tu contraseña fue actualizada correctamente.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo + Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4 animate-float">
          <LogoZS className="w-14 h-14 text-zs-blue" />
        </div>
        <h1 className="text-2xl font-bold text-zs-text-primary tracking-tight">
          {cardTitle}
        </h1>
        {!isSuccess && (
          <p className="text-zs-text-muted text-sm mt-1 text-center">
            {hasResetToken
              ? "Define una contraseña nueva para recuperar tu cuenta."
              : "Ingresa tu correo para recibir instrucciones de recuperación."}
          </p>
        )}
      </div>

      {/* Card glassmorphism */}
      <div className="glowing-box">
        <div className="glowing-content">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-zs-teal/15 border border-zs-teal/30">
                <CheckCircle2 className="w-8 h-8 text-zs-teal" />
              </div>
              <p className="text-zs-text-secondary text-sm mb-8 leading-relaxed">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="zs-btn-primary w-full"
              >
                Volver al Login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={hasResetToken ? handleResetPassword : handleSendEmail}
              className="space-y-4"
            >
              {error && (
                <div className="p-3.5 text-sm text-zs-error border border-zs-error/20 rounded-xl bg-zs-error/10 text-center">
                  {error}
                </div>
              )}

              {!hasResetToken && (
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="zs-input"
                  placeholder="hola@tunegocio.com"
                />
              )}

              {hasResetToken && (
                <>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="zs-input"
                    placeholder="Nueva contraseña (mínimo 8 caracteres)"
                  />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="zs-input"
                    placeholder="Repite la nueva contraseña"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="zs-btn-primary w-full mt-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading
                  ? "Procesando..."
                  : hasResetToken
                  ? "Actualizar contraseña"
                  : "Enviar enlace de recuperación"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Back link */}
      <p className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zs-blue hover:text-zs-purple transition-colors font-semibold"
        >
          <ArrowLeft className="w-3 h-3" />
          Volver al Login
        </Link>
      </p>
    </div>
  );
}

export default function RecuperarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zs-bg-primary flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zs-blue" />
        </div>
      }
    >
      <RecuperarContent />
    </Suspense>
  );
}
