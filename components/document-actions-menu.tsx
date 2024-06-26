"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Trash2 } from "lucide-react"
import React from "react"

type Props = {
  id: string
}

export const DocumentActionsMenu: React.FC<Props> = ({ id }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="gap-3"
          onClick={async (event) => {
            event.stopPropagation()
            const res = await fetch(`/api/documents/${id}/raw`, {
              method: "GET",
            })
            const url = await res.json()
            location.href = url
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
            await fetch(`/api/documents/${id}`, {
              method: "DELETE",
            })
            location.href = "/documents"
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
