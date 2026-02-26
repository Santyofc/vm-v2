// lib/mail.ts
import { Resend } from "resend";

// Función lazy que garantiza que process.env se lea solo cuando se invoca
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const resend = getResendClient();
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: "Zona Sur Tech <onboarding@resend.dev>",
    to: email,
    subject: "Verifica tu correo electrónico",
    html: `<p>Haz clic <a href="${confirmLink}">aquí</a> para confirmar tu correo.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resend = getResendClient();
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Zona Sur Tech <onboarding@resend.dev>",
    to: email,
    subject: "Recupera tu contraseña",
    html: `<p>Haz clic <a href="${resetLink}">aquí</a> para reestablecer tu contraseña.</p>`,
  });
};
