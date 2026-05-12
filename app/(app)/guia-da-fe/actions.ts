"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function markStepCompleted(guiaDaFeId: string, completed: boolean) {
  const session = await auth()
  if (!session?.user) throw new Error("Não autorizado")

  await db.userProgress.upsert({
    where: {
      userId_guiaDaFeId: {
        userId: session.user.id,
        guiaDaFeId
      }
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null
    },
    create: {
      userId: session.user.id,
      guiaDaFeId,
      completed,
      completedAt: completed ? new Date() : null
    }
  })

  revalidatePath("/guia-da-fe")
}
