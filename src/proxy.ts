import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Guard /hq routes (admin only)
  if (pathname.startsWith("/hq")) {
    const isAuthenticated = request.cookies.has("admin_access_token");

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/hq/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hq/((?!login).*)"],
};
