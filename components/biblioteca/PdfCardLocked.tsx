import { PdfDocument } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export function PdfCardLocked({ document }: { document: PdfDocument }) {
  let lockReason = "Requer Upgrade"
  if (document.d7Rule) {
    lockReason = "Disponível em 7 dias"
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
        <div className="flex flex-col items-center bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
          <Lock className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium uppercase tracking-wider">{lockReason}</span>
        </div>
      </div>
      <CardHeader className="pb-4 opacity-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg">{document.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="opacity-50">
        <div className="w-full text-center px-4 py-2 bg-zinc-900 rounded-md text-sm font-medium border border-zinc-800">
          Bloqueado
        </div>
      </CardContent>
    </Card>
  )
}
