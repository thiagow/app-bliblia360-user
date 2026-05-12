"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type DailyTrackerData = {
  date: string // "yyyy-MM-dd"
  practices: string[]
}

// Save or update practices for a given day
export async function saveDailyPractices(date: string, practices: string[]) {
  const session = await auth()
  if (!session?.user) throw new Error("Não autorizado")

  const parsedDate = new Date(`${date}T00:00:00.000Z`)

  await db.dailyTracker.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: parsedDate,
      },
    },
    update: { practices },
    create: {
      userId: session.user.id,
      date: parsedDate,
      practices,
    },
  })

  revalidatePath("/guia-da-fe")
}

// Get all trackers for a given month
export async function getMonthlyTrackers(
  year: number,
  month: number
): Promise<DailyTrackerData[]> {
  const session = await auth()
  if (!session?.user) return []

  const startDate = new Date(Date.UTC(year, month - 1, 1))
  const endDate = new Date(Date.UTC(year, month, 1))

  const records = await db.dailyTracker.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  return records.map((r) => ({
    date: r.date.toISOString().split("T")[0],
    practices: r.practices,
  }))
}
