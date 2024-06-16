"use client"

import "@ungap/with-resolvers"
import React, { useEffect, useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type Props = {
  id: string
}

export const FilePreview: React.FC<Props> = ({ id }) => {
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true)
      const res = await fetch(`/api/documents/${id}/raw`, {
        next: { revalidate: 3500 }, // slightly less than the expiry of the signed url
        method: "GET",
        cache: "force-cache",
      })
      const url = await res.json()
      setFile(url)
      setLoading(false)
    }

    fetchDocument()
  }, [id])

  const memoizedFile = useMemo(() => {
    if (file) {
      return { url: file }
    }
  }, [file])

  if (loading || !memoizedFile) {
    return (
      <div className="w-[270px] h-[350px] flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    )
  }

  return (
    <Document
      file={memoizedFile}
      loading={
        <div className="w-[270px] h-[350px] flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      }
    >
      <Page
        pageNumber={1}
        width={270}
        renderTextLayer={false}
        className="shadow-lg w-min"
        renderAnnotationLayer={false}
      />
    </Document>
  )
}
