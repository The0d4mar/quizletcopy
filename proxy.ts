import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

type AuthProxyRequest = NextRequest & {
  auth: { user?: { id?: string } } | null;
};

const protectedPathPrefixes = ["/profile", "/sets", "/deck/create", "/folders"];

export default auth((request: AuthProxyRequest) => {
  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPathPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtectedPath || request.auth) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);

  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};