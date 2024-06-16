"use client"

import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

type Props = {
  data: ProcessBirdsResultRow
}

export const BirdCountTable: React.FC<Props> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [documentData, setDocumentData] = useState(data)
  const [sortDescending, setSortDescending] = useState(true)

  const birds = !!documentData.bird_counts
    ? Object.entries(documentData.bird_counts)
        .map(([birdName, count]) => ({
          name: birdName,
          count,
        }))
        .sort((a, b) =>
          sortDescending ? b.count - a.count : a.count - b.count
        )
    : []
  const filteredBirds = birds.filter((bird) =>
    bird.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBirds.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBirds.length / itemsPerPage)
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const pollData = async () => {
      const res = await fetch(`/api/documents/${data.id}`, { method: "GET" })
      const result = (await res.json()) as ProcessBirdsResultRow
      setDocumentData(result)
      const isProcessing = documentData.status === "processing"
      if (!isProcessing) {
        setDocumentData(result)
        clearInterval(intervalId)
      }
    }

    // poll every 5 seconds until no longer processing
    if (documentData.status === "processing") {
      intervalId = setInterval(pollData, 5000)
    }

    return () => clearInterval(intervalId)
  }, [documentData])

  return (
    <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-end gap-2 justify-between">
        <div className="text-xl font-semibold text-neutral-700 px-2">
          Birds found
        </div>
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="max-w-[400px]"
        />
      </div>
      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bird Name</TableHead>
              <TableHead
                className="cursor-pointer float-end flex items-center"
                onClick={() => setSortDescending(!sortDescending)}
              >
                Count {sortDescending ? "↓" : "↑"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((bird, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bird.name}</TableCell>
                <TableCell className="text-right">{bird.count}</TableCell>
              </TableRow>
            ))}

            {documentData.status === "processing" && (
              <TableRow className="w-full hover:bg-transparent">
                <TableCell colSpan={2}>
                  <div className="flex flex-col w-full items-center justify-center h-[20vh] gap-6 border-dashed border">
                    <h3 className="text-xl text-center">
                      <div className="flex items-center gap-2">
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
                        {"Processing document"}
                      </div>
                    </h3>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredBirds.length === 0 && birds.length > 0 && (
              <TableRow className="w-full hover:bg-transparent">
                <TableCell colSpan={2}>
                  <div className="flex flex-col w-full items-center justify-center h-[20vh] gap-6 border-dashed border">
                    <h3 className="text-xl text-center">{"No results"}</h3>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {birds.length === 0 && documentData.status === "success" && (
              <TableRow className="w-full hover:bg-transparent">
                <TableCell colSpan={2}>
                  <div className="flex flex-col w-full items-center justify-center h-[20vh] gap-6 border-dashed border">
                    <h3 className="text-xl text-center">
                      {"No birds found in document"}
                    </h3>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={
                  currentPage === 1 ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                }
                tabIndex={
                  currentPage === 1 ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                    ? -1
                    : undefined
                }
                className={
                  currentPage === 1 ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                aria-disabled={
                  currentPage === totalPages ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                }
                tabIndex={
                  currentPage === totalPages ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                    ? -1
                    : undefined
                }
                className={
                  currentPage === totalPages ||
                  birds.length === 0 ||
                  documentData.status === "processing"
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
