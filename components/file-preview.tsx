"use client"

import "@ungap/with-resolvers"
import React, { useMemo } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

type Props = {
  data: Uint8Array | undefined
}

export const FilePreview: React.FC<Props> = ({ data }) => {
  const memoizedData = useMemo(() => data, [data])

  return (
    <Document
      file={{ data: memoizedData }}
      loading={
        <div className="w-[250px] h-[320px] flex justify-center items-center">
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
