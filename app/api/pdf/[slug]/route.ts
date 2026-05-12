import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canAccessContent } from "@/lib/plan-access"
import { NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

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

  try {
    let fileName = pdfDocument.fileUrl;
    if (fileName.startsWith('/pdfs/')) {
      fileName = fileName.replace('/pdfs/', '');
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    })

    const response = await s3Client.send(command)

    if (!response.Body) {
      return new NextResponse("File not found on R2", { status: 404 })
    }

    // Convert the stream to a Web ReadableStream for NextResponse
    // Since AWS SDK v3 in Node.js returns a Readable, we can cast it to any and Next.js handles it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = response.Body as any

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${params.slug}.pdf"`,
      },
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching PDF from R2:", error)
    if (error.name === 'NoSuchKey') {
      return new NextResponse("File not found on R2", { status: 404 })
    }
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
