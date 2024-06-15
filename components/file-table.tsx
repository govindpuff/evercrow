"use client"

import React, { useEffect, useState } from "react"

type Props = {
  data: ProcessBirdsResultRow[]
}

export const FileTable: React.FC<Props> = ({ data }) => {
  const [rows, setRows] = useState<ProcessBirdsResultRow[]>(data)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const pollData = async () => {
      const res = await fetch("/api/jobs", { method: "GET" })
      const result = (await res.json()) as ProcessBirdsResultRow[]
      setRows(result)
      const isProcessing = result.some((row) => row.status === "processing")
      if (!isProcessing) {
        setRows(result)
        clearInterval(intervalId)
      }
    }

    // poll every 5 seconds until no rows are still processing
    if (rows.some((row) => row.status === "processing")) {
      intervalId = setInterval(pollData, 5000)
    }

    return () => clearInterval(intervalId)
  }, [rows])

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          {row.id} - {row.filename} - {row.status}
        </div>
      ))}
    </div>
  )
}
