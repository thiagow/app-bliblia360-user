import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Redireciona para /login?signedOut=1 — o middleware aceita esse query param
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("signedOut", "1")

  const response = NextResponse.redirect(loginUrl, { status: 303 })

  // Todos os possíveis nomes de cookie do next-auth v5 / Auth.js
  const cookieNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
    // Legado next-auth v4
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ]

  for (const name of cookieNames) {
    const isSecurePrefixed = name.startsWith("__Secure-") || name.startsWith("__Host-")

    // Deleta com secure: true (match cookies HTTPS da Netlify)
    response.cookies.set(name, "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // SEMPRE true para cookies __Secure-/__Host- — obrigatório pela spec
      secure: isSecurePrefixed ? true : false,
    })
  }

  return response
}
