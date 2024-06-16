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

export default function BirdCountTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const birds = [
    { name: "Bald Eagle", count: 250 },
    { name: "Blue Jay", count: 1500 },
    { name: "Cardinal", count: 800 },
    { name: "Chickadee", count: 1200 },
    { name: "Crow", count: 2000 },
    { name: "Dove", count: 1800 },
    { name: "Falcon", count: 150 },
    { name: "Finch", count: 1000 },
    { name: "Goose", count: 500 },
    { name: "Hawk", count: 300 },
    { name: "Heron", count: 400 },
    { name: "Hummingbird", count: 750 },
    { name: "Loon", count: 200 },
    { name: "Mockingbird", count: 900 },
    { name: "Owl", count: 600 },
    { name: "Pelican", count: 350 },
    { name: "Robin", count: 1400 },
    { name: "Sparrow", count: 2500 },
    { name: "Swan", count: 280 },
    { name: "Vulture", count: 180 },
  ]
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
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
                className={
                  currentPage === 1
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
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : undefined}
                className={
                  currentPage === totalPages
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
