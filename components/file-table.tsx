"use client"

import { formatFileSize, getTimeSince } from "@/lib/utils"
import { Check, Download, Ellipsis, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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
      const res = await fetch("/api/documents", { method: "GET" })
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
          <TableHead>Size</TableHead>
          <TableHead>Processed</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => router.push(`/documents/${row.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{row.id}</TableCell>
            <TableCell className="font-medium">{row.filename}</TableCell>
            <TableCell className="font-medium">
              {formatFileSize(row.filesize)}
            </TableCell>
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
            <TableCell>{getTimeSince(new Date(row.created_at))}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="gap-3"
                    onClick={async (event) => {
                      event.stopPropagation()
                      const res = await fetch(`/api/documents/${row.id}/raw`, {
                        next: { revalidate: 3500 }, // slightly less than the expiry of the signed url
                        method: "GET",
                        cache: "force-cache",
                      })
                      const url = await res.json()
                      window.location.href = url
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-3"
                    onClick={(event) => event.stopPropagation()}
                    onSelect={async () => {
                      await fetch(`/api/documents/${row.id}`, {
                        method: "DELETE",
                      })
                      location.reload()
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow className="w-full hover:bg-transparent">
            <TableCell colSpan={6}>
              <div className="flex flex-col w-full items-center justify-center h-[20vh] gap-6 border-dashed border">
                <h3 className="text-xl text-center">
                  {"There's nothing here yet"}
                </h3>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
