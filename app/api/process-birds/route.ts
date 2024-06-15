import { s3 } from "@/lib/s3"
import { textract } from "@/lib/textract"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import {
  GetDocumentTextDetectionCommand,
  JobStatus,
  StartDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

const getTextractResult = async (jobId: string) => {
  let result
  let status: JobStatus = "IN_PROGRESS"

  while (status === "IN_PROGRESS") {
    result = await textract.send(
      new GetDocumentTextDetectionCommand({ JobId: jobId })
    )
    status = result.JobStatus!
    if (status === "IN_PROGRESS") {
      await new Promise((resolve) => setTimeout(resolve, 5000)) // wait for 5 seconds before polling again
    }
  }

  return result
}

const processTextract = async (id: string) => {
  const textractCommand = new StartDocumentTextDetectionCommand({
    DocumentLocation: {
      S3Object: { Bucket: "evercrow-files", Name: `${id}.pdf` },
    },
  })

  const { JobId: jobId } = await textract.send(textractCommand)

  if (!jobId) {
    return NextResponse.json(
      { error: "Failed to process the document" },
      { status: 500 }
    )
  }

  const textractResult = await getTextractResult(jobId)

  if (textractResult?.JobStatus === "SUCCEEDED") {
    await sql`UPDATE process_birds_results SET status = 'success' WHERE id = ${id};`
  } else {
    await sql`UPDATE process_birds_results SET status = 'failed' WHERE id = ${id};`
  }

  const words = textractResult?.Blocks?.filter(
    (block) => block.BlockType === "WORD"
  ).map((block) => block.Text)

  console.log(words)
}

export async function POST(req: Request) {
  const formData = await req.formData()

  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const id = crypto.randomUUID()
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: "evercrow-files",
        Key: `${id}.pdf`,
        Body: buffer,
      })
    )

    await sql`INSERT INTO process_birds_results (id, filename, status) VALUES (${id}, ${file.name}, 'processing');`

    // kick this async task off
    processTextract(id)

    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error("Error calling Textract:", error)
    return NextResponse.json(
      { error: "Failed to process the document" },
      { status: 500 }
    )
  }
}
