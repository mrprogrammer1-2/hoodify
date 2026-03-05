import { NextResponse, type NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();

    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
      return NextResponse.redirect(
        new URL("/api/auth/login?post_login_redirect_url=/admin", request.url),
      );
    }

    const token = await getAccessTokenRaw();

    if (!token) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Decode JWT payload
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    console.log("token payload:", payload);

    // 🔥 CHECK PERMISSIONS (not roles)
    const permissions: string[] = payload?.permissions || [];

    console.log("permissions from token:", permissions);

    const hasAdminPermission = permissions.includes("admin:allowed");

    if (!hasAdminPermission) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
