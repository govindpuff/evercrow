"use server"

import { s3 } from "@/lib/s3"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { sql } from "@vercel/postgres"
import { notFound } from "next/navigation"

export const getFileFromS3 = async (id: string) => {
  try {
    const [object, { rows }] = await Promise.all([
      s3.send(
        new GetObjectCommand({ Bucket: "evercrow-files", Key: `${id}.pdf` })
      ),
      sql`SELECT * FROM process_birds_results where id = ${id}`,
    ])

    const pdfFile = await object.Body?.transformToByteArray()
    const data = rows[0] as ProcessBirdsResultRow

    if (!data || !pdfFile) {
      return notFound()
    }

    return { data, pdfFile }
  } catch (e) {
    console.error(e)
    notFound()
  }
}
