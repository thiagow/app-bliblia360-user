import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get("year") ?? String(new Date().getUTCFullYear()))
  const month = parseInt(searchParams.get("month") ?? String(new Date().getUTCMonth() + 1))

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
  }

  const startDate = new Date(Date.UTC(year, month - 1, 1))
  const endDate = new Date(Date.UTC(year, month, 1))

  const records = await db.dailyTracker.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startDate, lt: endDate },
    },
  })

  const trackers = records.map((r) => ({
    date: r.date.toISOString().split("T")[0],
    practices: r.practices,
  }))

  return NextResponse.json({ trackers })
}
