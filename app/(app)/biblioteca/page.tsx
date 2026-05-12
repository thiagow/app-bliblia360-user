import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { canAccessContent } from "@/lib/plan-access"
import { PdfCard } from "@/components/biblioteca/PdfCard"
import { PdfCardLocked } from "@/components/biblioteca/PdfCardLocked"
import { PdfDocument } from "@prisma/client"

export default async function BibliotecaPage() {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  const documents = await db.pdfDocument.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-serif text-amber-500">Biblioteca de PDFs</h1>
        <p className="text-sm md:text-base text-zinc-400 mt-2">Mapas, resumos e materiais de apoio.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {documents.map((doc: PdfDocument) => {
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
