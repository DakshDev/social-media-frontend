import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Auth
  if (pathname === "/auth/create" || pathname === "/auth/login") {
    if (token) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }
  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|svgs|images|api).*)"],
};
