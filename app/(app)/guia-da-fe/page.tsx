import { auth } from "@/lib/auth"
import { getMonthlyTrackers } from "./actions"
import { GuiadaFeClient } from "./client"

export default async function GuiaDaFePage() {
  const session = await auth()
  if (!session?.user) return null

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const today = now.toISOString().split("T")[0]

  const initialTrackers = await getMonthlyTrackers(year, month)

  return (
    <div className="min-h-full">
      <header className="mb-5">
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Guia da Fé</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Seu rastreador diário de práticas espirituais.
        </p>
      </header>

      <GuiadaFeClient
        initialTrackers={initialTrackers}
        today={today}
        initialYear={year}
        initialMonth={month}
      />
    </div>
  )
}
