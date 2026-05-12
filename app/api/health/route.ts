import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Endpoint temporário de diagnóstico - remover após validação
export async function GET() {
  try {
    // Testa conexão com o banco
    const count = await db.user.count()
    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount: count,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({
      status: "error",
      database: "disconnected",
      error: message,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      }
    }, { status: 500 })
  }
}
