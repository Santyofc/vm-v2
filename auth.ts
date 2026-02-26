import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // El punto inicial es obligatorio para compartir la sesión entre subdominios
        domain: process.env.NODE_ENV === "production" ? ".zonasurtech.online" : undefined,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. BACKDOOR MAESTRO (Lee directo del .env, no requiere que el usuario exista en DB)
        if (
          email === process.env.AUTH_MASTER_EMAIL && 
          password === process.env.AUTH_MASTER_PASSWORD
        ) {
          console.log("🔥 ACCESO MAESTRO APROBADO 🔥");
          return { id: "master-admin", email: email, role: "SUPERADMIN" };
        }

        // 2. VALIDACIÓN NORMAL (Usuarios de la base de datos)
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        const parsedUrl = new URL(url);
        // Permitir redirecciones a cualquier subdominio tuyo o localhost
        if (parsedUrl.hostname.endsWith(".zonasurtech.online") || parsedUrl.hostname === "localhost") {
          return url;
        }
      } catch (e) {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "SUPERADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) || "SUPERADMIN";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
