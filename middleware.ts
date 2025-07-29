import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/_next",
  "/favicon.ico",
  "/api/auth",
  "/images",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Izinkan akses ke path publik (login, register, dll)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Cek apakah user memiliki session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token:", token);
  console.log("Path:", pathname);

  // Jika tidak ada token/session, redirect ke /auth/login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|auth/login|auth/register).*)",
  ],
};