import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { rows } =
    await sql<ProcessBirdsResultRow>`SELECT * FROM process_birds_results;`

  return NextResponse.json(rows)
}
