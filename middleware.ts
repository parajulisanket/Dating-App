import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "access_token";

// Routes that can be accessed without being logged in
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/login/email",
  "/signup",
  "/signup/email",
  "/signup/phone",
  "/welcome-back",
  "/signup/verify",
  "/login/verify",
  "/login/reset",
  "/login/quick",
  "/login/forgot",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let Next.js internals and static files pass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  //  Public routes are always allowed
  if (isPublic) {
    return NextResponse.next();
  }

  // All non-public routes are protected:
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  //  Logged in and route is protected → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
