import { BirdCountTable } from "@/components/bird-count-table"
import { FilePreview } from "@/components/file-preview"
import { s3 } from "@/lib/s3"
import { formatFileSize, getTimeSince } from "@/lib/utils"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { sql } from "@vercel/postgres"
import { MoveLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const fetchDocument = async (id: string) => {
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

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

async function page({ params }: { params: { id: string } }) {
  const { data, pdfFile } = await fetchDocument(params.id)

  return (
    <main className="flex flex-col w-full py-32 px-8 gap-8">
      <Link
        href={"/documents"}
        className="flex items-center gap-2 text-xl font-semibold text-neutral-600 duration-300 hover:text-black w-min whitespace-nowrap"
      >
        <MoveLeft />
        All documents
      </Link>
      <div className="w-full flex gap-4">
        <div className="p-4 bg-neutral-50 rounded-lg shadow flex flex-col gap-6">
          <FilePreview data={pdfFile} />
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
