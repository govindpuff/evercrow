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

export const runtime = "edge"

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

export async function POST(req: Request) {
  const formData = await req.formData()

  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: "evercrow-files",
        Key: file.name,
        Body: buffer,
      })
    )

    const id = crypto.randomUUID()

    const result =
      await sql`INSERT INTO process_birds_results (id, filename, status) VALUES (${id}, ${file.name}, "PROCESSING");`

    console.log(result)

    const textractCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: { Bucket: "evercrow-files", Name: id },
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

    const words = textractResult?.Blocks?.filter(
      (block) => block.BlockType === "WORD"
    ).map((block) => block.Text)

    return NextResponse.json({ words }, { status: 200 })
  } catch (error) {
    console.error("Error calling Textract:", error)
    return NextResponse.json(
      { error: "Failed to process the document" },
      { status: 500 }
    )
  }
}
