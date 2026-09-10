import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "snorlaxin_session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "snorlaxin-dev-secret-change-me");
  let authed = false;
  if (token) {
    try {
      await jwtVerify(token, secret);
      authed = true;
    } catch {
      authed = false;
    }
  }

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname === "/login" && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
