import { s3 } from "@/lib/s3"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(params.id)
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: "evercrow-files",
        Key: `${params.id}.pdf`,
      }),
      { expiresIn: 3600 }
    )

    console.log(url)

    return NextResponse.json(url)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Failed to fetch raw document" },
      { status: 500 }
    )
  }
}
