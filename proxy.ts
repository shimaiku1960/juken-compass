import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

export const proxy = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login"];
  const isPublic = publicPaths.includes(pathname);

  // 未ログインで API を叩いたら 401
  if (!sessionCookie && pathname.startsWith("/api/")) {
    // Better Auth 自身のエンドポイントは除外
    if (!pathname.startsWith("/api/auth/")) {
      return NextResponse.json({ error: "未認証" }, { status: 401 });
    }
  }

  // 未ログインで保護ページに来たら /login へ
  if (!sessionCookie && !isPublic && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
