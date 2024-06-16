import { FileTable } from "@/components/file-table"
import Uploader from "@/components/uploader"
import { sql } from "@vercel/postgres"

const fetchResults = async () => {
  const { rows } =
    await sql<ProcessBirdsResultRow>`SELECT * FROM process_birds_results;`
  return rows
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

export default async function Documents() {
  const data = await fetchResults()

  return (
    <main className="flex flex-col items-center py-32 px-8">
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="text-xl font-semibold">Uploaded Files</div>
          <Uploader />
        </div>
        <FileTable data={data} />
      </div>
    </main>
  )
}
