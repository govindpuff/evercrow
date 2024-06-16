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
import { useState } from "react"

type Props = {
  data: ProcessBirdsResultRow
}

export const BirdCountTable: React.FC<Props> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const birds = !!data.bird_counts
    ? Object.entries(data.bird_counts).map(([birdName, count]) => ({
        name: birdName,
        count,
      }))
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
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1"
        />
      </div>
      <div className="overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bird Name</TableHead>
              <TableHead className="float-end flex items-center">
                Count
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

            {data.status === "processing" && (
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
                        {"Processing Birds"}
                      </div>
                    </h3>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {birds.length === 0 && data.status === "success" && (
              <TableRow className="w-full hover:bg-transparent">
                <TableCell colSpan={2}>
                  <div className="flex flex-col w-full items-center justify-center h-[20vh] gap-6 border-dashed border">
                    <h3 className="text-xl text-center">{"No birds found"}</h3>
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
                  data.status === "processing"
                }
                tabIndex={
                  currentPage === 1 ||
                  birds.length === 0 ||
                  data.status === "processing"
                    ? -1
                    : undefined
                }
                className={
                  currentPage === 1 ||
                  birds.length === 0 ||
                  data.status === "processing"
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
                  data.status === "processing"
                }
                tabIndex={
                  currentPage === totalPages ||
                  birds.length === 0 ||
                  data.status === "processing"
                    ? -1
                    : undefined
                }
                className={
                  currentPage === totalPages ||
                  birds.length === 0 ||
                  data.status === "processing"
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
