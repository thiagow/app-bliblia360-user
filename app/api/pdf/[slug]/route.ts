import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canAccessContent } from "@/lib/plan-access"
import { NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const pdfDocument = await db.pdfDocument.findUnique({
    where: { slug: params.slug }
  })

  if (!pdfDocument) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const hasAccess = canAccessContent(
    session.user.plan,
    session.user.createdAt,
    pdfDocument.planAccess,
    pdfDocument.isBonus,
    pdfDocument.d7Rule
  )

  if (!hasAccess) {
    return new NextResponse("Forbidden - Upgrade required or D7 not reached", { status: 403 })
  }

  // In MVP with local SQLite and no bucket, we will just read from a local 'public/pdfs' folder
  // Or simply return a placeholder buffer if the file doesn't exist.
  // In production, you would fetch from R2 Bucket using fetch(pdfDocument.fileUrl)
  
  try {
    // Recupera o nome do arquivo da coluna fileUrl
    let fileName = pdfDocument.fileUrl;
    // Remove o prefixo /pdfs/ caso exista para evitar duplicidade no path.join
    if (fileName.startsWith('/pdfs/')) {
      fileName = fileName.replace('/pdfs/', '');
    }
    
    const filePath = path.join(process.cwd(), 'public', 'pdfs', fileName)
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${params.slug}.pdf"`,
        },
      })
    } else {
      // Return a 404 if file not on disk
      return new NextResponse("File not found on disk", { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
