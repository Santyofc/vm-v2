import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/admin",
  "/calendario",
  "/clientes",
  "/servicios",
  "/configuracion",
  "/settings",
];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/recuperar",
  "/new-password",
  "/verify",
];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const { pathname } = url;

  const mainDomain = "zonasurtech.online";
  const isMainDomain =
    hostname === mainDomain || hostname === `www.${mainDomain}`;

  // 1. Subdomain Routing Mapping
  const subdomainMapping: Record<string, string> = {
    admin: "/admin",
    cita: "/dashboard",
    play: "/games",
    pizarra: "/whiteboard",
  };

  const subdomain = hostname.split(".")[0];
  const targetFolder = subdomainMapping[subdomain];

  if (targetFolder && !isMainDomain) {
    if (!pathname.startsWith(targetFolder)) {
      url.pathname = `${targetFolder}${pathname === "/" ? "" : pathname}`;
    }
  }

  // 2. Auth Logic (JWT-Only, Ultra Fast)
  const token = await getToken({
    req,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const targetPath = url.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    targetPath.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.includes(targetPath);

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL(`https://${mainDomain}/login`, req.url),
    );
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protección admin
  if (targetPath.startsWith("/admin") && token?.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Subdomain Rewrite Exit
  if (targetFolder && !isMainDomain && !pathname.startsWith(targetFolder)) {
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
