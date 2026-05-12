import { PdfDocument } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function PdfCard({ document }: { document: PdfDocument }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-amber-500/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <FileText className="w-6 h-6 text-amber-500" />
          </div>
          <CardTitle className="text-lg">{document.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {document.description && (
          <CardDescription className="text-zinc-400 mb-4">
            {document.description}
          </CardDescription>
        )}
        <Link 
          href={`/biblioteca/${document.slug}`}
          className="inline-block w-full text-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm font-medium transition-colors"
        >
          Abrir Material
        </Link>
      </CardContent>
    </Card>
  )
}
