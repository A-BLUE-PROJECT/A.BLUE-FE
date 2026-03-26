import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Guard /hq routes
  if (pathname.startsWith("/hq")) {
    const isAuthenticated = 
      request.cookies.has("next-auth.session-token") || 
      request.cookies.has("__Secure-next-auth.session-token");
    
    // Redirect to home if strictly blocked
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hq/:path*"],
};
