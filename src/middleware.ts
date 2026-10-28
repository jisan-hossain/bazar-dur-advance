import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Better Auth-এর সম্ভাব্য সব কুকি নেম চেক করা হচ্ছে
  const cookies = request.cookies;
  const hasSession = 
    cookies.get("better-auth.session_token") ||
    cookies.get("__Secure-better-auth.session_token") ||
    cookies.get("better_auth_session") ||
    Array.from(cookies.getAll()).some(c => c.name.includes("session"));

  // যদি কোনো কুকি না থাকে, তবে সাথে সাথে /sign-in পেজে পাঠাবে
  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/product/:path*",
    "/category/:path*",
  ],
};