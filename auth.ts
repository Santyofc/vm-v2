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
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? ".zonasurtech.online"
            : undefined,
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

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId, // Inject tenantId for multi-tenant routing isolating
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        const parsedUrl = new URL(url);
        // Permitir redirecciones a subdominios o localhost
        if (
          parsedUrl.hostname.endsWith(".zonasurtech.online") ||
          parsedUrl.hostname === "localhost"
        ) {
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
        token.role = (user as any).role || "USER";
        token.tenantId = (user as any).tenantId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) || "USER";
        (session.user as any).tenantId = (token.tenantId as string) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
