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
          O Guia da Fé é o seu acompanhamento diário de disciplinas espirituais. Marque cada prática que você realizou no dia — oração, estudo da Bíblia, louvor, jejum, pregação, culto e evangelismo — e acompanhe o seu crescimento ao longo do mês. Pequenos hábitos praticados todos os dias constroem uma fé sólida e transformadora! 🙏
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
