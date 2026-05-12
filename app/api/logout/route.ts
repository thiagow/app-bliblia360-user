import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const response = NextResponse.redirect(new URL("/login", url.origin), {
    // 303 See Other força o browser a fazer GET em /login
    status: 303,
  })

  // Todos os possíveis nomes de cookie do next-auth v5 / Auth.js
  // O prefixo muda conforme o protocolo: HTTP = "authjs.", HTTPS = "__Secure-authjs."
  const cookiesToDelete = [
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

  for (const name of cookiesToDelete) {
    // Deleta setando expiração no passado em todas as variações de path/domain
    response.cookies.set(name, "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
    })
  }

  return response
}
