import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Public routes that don't require authentication
const publicRoutes = ["/login", "/api/auth", "/api/health", "/api/logout"]

export default auth((req) => {
  const session = req.auth
  const { pathname, searchParams } = req.nextUrl

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Not logged in + private route → go to login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged in + visiting /login → redirect to /home
  // EXCEPT when signedOut=1 (coming from /api/logout) — let them through
  if (session && pathname === "/login") {
    if (searchParams.get("signedOut") === "1") {
      // User just signed out. Even if cookie deletion had a race condition,
      // we let them through to the login page. The cookie will expire naturally.
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/home", req.url))
  }

  if (session) {
    const { firstAccess } = session.user as any

    if (
      firstAccess &&
      pathname !== "/change-password" &&
      !pathname.startsWith("/api/")
    ) {
      return NextResponse.redirect(new URL("/change-password", req.url))
    }

    if (!firstAccess && pathname === "/change-password") {
      return NextResponse.redirect(new URL("/home", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
