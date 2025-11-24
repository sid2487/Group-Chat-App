import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isRoomsPage = pathname.startsWith("/rooms");

  if (!token && isRoomsPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/rooms", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/rooms/:path*", "/login", "/register"],
};
