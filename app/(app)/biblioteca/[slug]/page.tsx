import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { canAccessContent } from "@/lib/plan-access"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"

const PdfViewer = dynamic(() => import("@/components/biblioteca/PdfViewer").then(mod => mod.PdfViewer), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500">Carregando leitor de PDF...</div>
})

export default async function PdfPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  const user = session?.user

  if (!user) return null

  const document = await db.pdfDocument.findUnique({
    where: { slug: params.slug }
  })

  if (!document) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Documento não encontrado</h2>
        <Link href="/biblioteca" className="text-amber-500 hover:underline">Voltar para a biblioteca</Link>
      </div>
    )
  }

  const hasAccess = canAccessContent(
    user.plan,
    user.createdAt,
    document.planAccess,
    document.isBonus,
    document.d7Rule
  )

  if (!hasAccess) {
    redirect("/biblioteca")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-amber-500">{document.title}</h1>
        <Link href="/biblioteca" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm">
          Voltar
        </Link>
      </div>
      <PdfViewer slug={params.slug} />
    </div>
  )
}
