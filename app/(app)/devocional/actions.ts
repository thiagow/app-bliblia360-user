"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function saveDevotional(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Não autorizado")

  const text = formData.get("text") as string
  const mood = formData.get("mood") as string

  if (!text || !mood) {
    throw new Error("Preencha todos os campos")
  }

  // Check if already created today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const existing = await db.devotional.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: today
      }
    }
  })

  if (existing) {
    throw new Error("Você já registrou seu devocional hoje.")
  }

  await db.devotional.create({
    data: {
      userId: session.user.id,
      text,
      mood,
      date: new Date()
    }
  })

  revalidatePath("/devocional")
}
