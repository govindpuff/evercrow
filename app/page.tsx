import { FileTable } from "@/components/file-table"
import Uploader from "@/components/uploader"
import { sql } from "@vercel/postgres"

const fetchResults = async () => {
  const { rows } =
    await sql<ProcessBirdsResultRow>`SELECT * FROM process_birds_results;`
  return rows
}

export default async function Home() {
  const data = await fetchResults()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <Uploader />
      <FileTable data={data} />
    </main>
  )
}
