import { BirdCountTable } from "@/components/bird-count-table"
import { DocumentActionsMenu } from "@/components/document-actions-menu"
import { FilePreview } from "@/components/file-preview"
import { formatFileSize, getTimeSince } from "@/lib/utils"
import { sql } from "@vercel/postgres"
import { MoveLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const fetchDocument = async (id: string) => {
  try {
    const { rows } =
      await sql`SELECT * FROM process_birds_results where id = ${id}`

    const data = rows[0] as ProcessBirdsResultRow

    if (!data) {
      return notFound()
    }

    return { data }
  } catch (e) {
    console.error(e)
    notFound()
  }
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

async function page({ params }: { params: { id: string } }) {
  const { data } = await fetchDocument(params.id)

  return (
    <main className="flex flex-col w-full py-32 px-8 gap-8">
      <div className="w-full flex justify-between items-center">
        <Link
          href={"/documents"}
          className="flex items-center gap-2 text-xl font-semibold text-neutral-600 duration-300 hover:text-black w-min whitespace-nowrap"
        >
          <MoveLeft />
          All documents
        </Link>
        <DocumentActionsMenu id={params.id} />
      </div>
      <div className="w-full flex gap-4">
        <div className="p-4 bg-neutral-50 rounded-lg shadow flex flex-col gap-6">
          <FilePreview id={params.id} />
          <div className="flex flex-col">
            <div className="font-medium">{data.filename}</div>
            <div className="font-light">{formatFileSize(data.filesize)}</div>
            <div>Uploaded {getTimeSince(new Date(data.created_at))}</div>
          </div>
        </div>
        <div className="w-full bg-neutral-50 shadow rounded-lg">
          <BirdCountTable data={data} />
        </div>
      </div>
    </main>
  )
}

export default page
