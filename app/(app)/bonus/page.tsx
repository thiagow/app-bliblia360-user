import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { canAccessContent } from "@/lib/plan-access"
import { PdfCard } from "@/components/biblioteca/PdfCard"
import { PdfCardLocked } from "@/components/biblioteca/PdfCardLocked"
import { redirect } from "next/navigation"

export default async function BonusPage() {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  if (user.plan !== 'ADVANCED') {
    redirect("/home") // Basic users shouldn't even see this page normally
  }

  const bonusDocuments = await db.pdfDocument.findMany({
    where: { isBonus: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif text-amber-500">Conteúdo Bônus</h1>
        <p className="text-zinc-400 mt-2">Materiais exclusivos para alunos do Plano Avançado.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonusDocuments.length === 0 && (
          <p className="text-zinc-500">Nenhum bônus disponível no momento.</p>
        )}
        {bonusDocuments.map((doc) => {
          const hasAccess = canAccessContent(
            user.plan,
            user.createdAt,
            doc.planAccess,
            doc.isBonus,
            doc.d7Rule
          )

          if (hasAccess) {
            return <PdfCard key={doc.id} document={doc} />
          } else {
            return <PdfCardLocked key={doc.id} document={doc} />
          }
        })}
      </div>
    </div>
  )
}
