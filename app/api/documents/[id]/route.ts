import { s3 } from "@/lib/s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await Promise.all([
      sql<ProcessBirdsResultRow>`DELETE FROM process_birds_results WHERE id LIKE ${params.id} ;`,
      s3.send(
        new DeleteObjectCommand({
          Bucket: "evercrow-files",
          Key: `${params.id}.pdf`,
        })
      ),
    ])
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
