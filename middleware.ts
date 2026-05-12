import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Public routes that don't require authentication
const publicRoutes = ["/login", "/api/auth"]

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  if (session) {
    const { firstAccess } = session.user as any
    
    // Redirect to change-password if first access
    if (firstAccess && pathname !== "/change-password" && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/change-password", req.url))
    }
    
    // Prevent access to change-password if not first access
    if (!firstAccess && pathname === "/change-password") {
      return NextResponse.redirect(new URL("/home", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
