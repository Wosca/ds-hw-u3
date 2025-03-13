import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;

  // Define public routes that don't require authentication
  const isPublicRoute =
    nextUrl.pathname.startsWith("/signin") ||
    nextUrl.pathname.startsWith("/signup") ||
    nextUrl.pathname === "/";

  // Redirect to login if accessing protected route while not logged in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  // Redirect to profile if accessing login/signup while already logged in
  if (
    isLoggedIn &&
    (nextUrl.pathname.startsWith("/signin") ||
      nextUrl.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/profile", nextUrl));
  }

  // Continue with the request for all other cases
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
