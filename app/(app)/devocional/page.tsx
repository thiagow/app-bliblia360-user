import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { DevotionalForm } from "@/components/devocional/DevotionalForm"

export default async function DevocionalPage() {
  const session = await auth()
  if (!session?.user) return null

  // Fetch past devotionals
  const pastDevotionals = await db.devotional.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 10
  })

  // Check if today is already logged
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const loggedToday = pastDevotionals.length > 0 && pastDevotionals[0].date >= today

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Devocional 360°</h1>
        <p className="text-sm md:text-base text-zinc-400 mt-2">Registre suas reflexões diárias e acompanhe seu progresso espiritual.</p>
      </header>

      {!loggedToday && (
        <section>
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Devocional de Hoje</h2>
          <DevotionalForm />
        </section>
      )}

      {loggedToday && (
        <div className="p-4 md:p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
          <h3 className="text-green-500 font-bold mb-1">Devocional de hoje concluído!</h3>
          <p className="text-sm text-green-400">Continue firme na sua jornada diária.</p>
        </div>
      )}

      <section className="pt-4 md:pt-8">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">Seus Registros</h2>
        {pastDevotionals.length === 0 ? (
          <p className="text-zinc-500 text-sm">Nenhum devocional registrado ainda.</p>
        ) : (
          <div className="space-y-4">
            {pastDevotionals.map((dev) => (
              <div key={dev.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(dev.date)}
                  </span>
                  <span className="text-[10px] md:text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                    {dev.mood}
                  </span>
                </div>
                <p className="text-sm md:text-base text-zinc-300 whitespace-pre-wrap">{dev.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
