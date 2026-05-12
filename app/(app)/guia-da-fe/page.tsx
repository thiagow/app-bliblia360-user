import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { canAccessContent } from "@/lib/plan-access"
import { GuiaStepCard } from "@/components/guia-da-fe/GuiaStepCard"
import { Lock } from "lucide-react"

export default async function GuiaDaFePage() {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  const steps = await db.guiaDaFe.findMany({
    orderBy: { order: "asc" }
  })

  const progress = await db.userProgress.findMany({
    where: { userId: user.id }
  })

  const progressMap = new Map(progress.map(p => [p.guiaDaFeId, p.completed]))

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Guia da Fé</h1>
        <p className="text-sm md:text-base text-zinc-400 mt-2">Sua trilha passo a passo para o destrave espiritual.</p>
      </header>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
        {steps.map((step) => {
          const hasAccess = canAccessContent(
            user.plan,
            user.createdAt,
            step.planAccess,
            step.isBonus,
            step.d7Rule
          )
          
          const isCompleted = progressMap.get(step.id) || false

          if (!hasAccess) {
            return (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-500">
                  <h3 className="font-bold text-sm md:text-base">Dia {step.order}</h3>
                  <p className="text-xs md:text-sm mt-1">Conteúdo bloqueado. Requer Upgrade ou liberação após 7 dias.</p>
                </div>
              </div>
            )
          }

          return (
            <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${isCompleted ? 'border-amber-500 bg-amber-500' : 'border-zinc-700 bg-zinc-900'} text-zinc-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                <span className={`text-xs font-bold ${isCompleted ? 'text-zinc-950' : 'text-zinc-400'}`}>{step.order}</span>
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)]">
                <GuiaStepCard step={step} isCompleted={isCompleted} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
