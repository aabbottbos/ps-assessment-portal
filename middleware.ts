import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes (except signin and error pages)
  if (pathname.startsWith("/admin")) {
    if (
      pathname !== "/admin/signin" &&
      pathname !== "/admin/error"
    ) {
      if (!req.auth) {
        // Not authenticated, redirect to signin
        const signInUrl = new URL("/admin/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
