import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type RoleObject = { name?: string; slug?: string; role?: string };
type RoleShape = string | RoleObject;
type TokenWithRoles = JWT & { roles?: RoleShape[] };

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search
  );
  return NextResponse.redirect(url);
}

const roleName = (r: RoleShape): string =>
  typeof r === "string" ? r : r.name ?? r.slug ?? r.role ?? "";

const isSuperadmin = (roles?: RoleShape[]): boolean =>
  Array.isArray(roles) &&
  roles.some((r) => roleName(r).toLowerCase() === "superadmin");

export async function middleware(req: NextRequest) {
  // Middleware ini khusus /admin/*
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenWithRoles | null;

  if (!token || !isSuperadmin(token.roles)) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

// Jalankan middleware HANYA untuk /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};