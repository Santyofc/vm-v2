import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const { pathname } = url;
  
  const mainDomain = "zonasurtech.online";
  const isMainDomain = hostname === mainDomain || hostname === `www.${mainDomain}`;

  // Redirección Auth Central
  if (pathname === "/login" && !isMainDomain) {
    return NextResponse.redirect(new URL(`https://${mainDomain}/login`, req.url));
  }

  // Mapeo Dinámico [cite: 2026-02-21]
  const subdomainMapping: Record<string, string> = {
    "admin": "/admin",
    "cita": "/tenant",
    "play": "/games",
    "pizarra": "/whiteboard"
  };

  const subdomain = hostname.split('.')[0];
  const targetFolder = subdomainMapping[subdomain];

  if (targetFolder) {
    if (pathname.startsWith(targetFolder)) return NextResponse.next();
    url.pathname = `${targetFolder}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Dominio Principal
  if (isMainDomain) {
    if (pathname === "/") { url.pathname = "/landing"; return NextResponse.rewrite(url); }
    if (pathname === "/login") { url.pathname = "/landing/login"; return NextResponse.rewrite(url); }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|svg|public).*)'],
};
