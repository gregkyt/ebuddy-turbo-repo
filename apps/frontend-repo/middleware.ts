import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "./constants/constant";

export const config = {
  matcher: ["/((?!api|_next|favicon|images).*)"],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookies = request.cookies;
  const { pathname } = request.nextUrl;
  const uid = request.nextUrl.searchParams.get("uid");
  const token = cookies.get(Cookies.accessToken)?.value;

  if (pathname === "/home" && (uid === null || token === undefined)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}
