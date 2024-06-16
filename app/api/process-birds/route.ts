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
import { generateObject } from "ai"
import { z } from "zod"
import { openai } from "@ai-sdk/openai"

export const dynamic = "force-dynamic"

const buildPrompt = (text: string) => {
  return `Below is a chunk of text representing a birdwatcher's notes. Your job is to read it and figure out how many of each type of bird the birdwatcher saw. 

  Make sure you pay attention to what counts as a sighting and what doesn't. For example, if the text says "sitting near the pond where I've seen robins before.",
  although it mentions "robins", it is not considered a sighting of robins.
  
  You must return a json object that satisfies this Typescript type: { birds: { [birdName: string]: number } }.  If no birds are mentioned at all, return a raw null.
  
  ---BEGIN TEXT---
  ${text}
  ---END TEXT---
  `
}

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

const processDocument = async (id: string) => {
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

  if (textractResult?.JobStatus !== "SUCCEEDED") {
    await sql`UPDATE process_birds_results SET status = 'failed' WHERE id = ${id};`
    console.error("Textract job failed!")
    return
  }

  const words = textractResult?.Blocks?.filter(
    (block) => block.BlockType === "WORD"
  )
    .map((block) => block.Text)
    .join(" ")

  if (!words) {
    console.error("Failed to extract words from PDF")
    return
  }

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({ birds: z.record(z.string(), z.number()).nullable() }),
    prompt: buildPrompt(words),
  })

  console.log(object)

  await sql`UPDATE process_birds_results SET status = 'success', bird_counts = ${JSON.stringify(
    object.birds
  )} WHERE id = ${id};`
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

    await sql`INSERT INTO process_birds_results (id, filename, filesize, status) VALUES (${id}, ${file.name}, ${file.size} ,'processing');`

    // kick this async task off
    processDocument(id)

    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error("Error calling Textract:", error)
    return NextResponse.json(
      { error: "Failed to process the document" },
      { status: 500 }
    )
  }
}
