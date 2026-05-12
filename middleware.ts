import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const publicRoutes = ["/login", "/api/auth", "/api/health"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Never block Next.js Server Actions (they POST to the same page)
  const isServerAction = req.method === "POST" && req.headers.get("next-action") !== null
  if (isServerAction) {
    return NextResponse.next()
  }

  // Allow public API routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check session via JWT token directly (works in Edge Runtime)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  })

  // Not authenticated - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Authenticated and on login page - redirect to home
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  // First access logic
  if (token) {
    const firstAccess = token.firstAccess as boolean | undefined

    if (firstAccess && pathname !== "/change-password" && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/change-password", req.url))
    }

    if (!firstAccess && pathname === "/change-password") {
      return NextResponse.redirect(new URL("/home", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
