"use client"

import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

type Props = {
  data: ProcessBirdsResultRow[]
}

export const FileTable: React.FC<Props> = ({ data }) => {
  const [rows, setRows] = useState<ProcessBirdsResultRow[]>(data)
  const router = useRouter()

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Uploaded At</TableHead>
          <TableHead>Processed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => router.push(`/files/${row.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{row.id}</TableCell>
            <TableCell className="font-medium">{row.filename}</TableCell>
            <TableCell>{new Date(row.created_at).toISOString()}</TableCell>
            <TableCell>
              {row.status === "processing" ? (
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
              ) : row.status === "failed" ? (
                <X className="h-6 w-6" />
              ) : (
                <Check className="h-6 w-6" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
