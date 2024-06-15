"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [file, setFile] = useState<File>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0])
  }

  const processFile = () => {
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setFile(undefined)
      setDialogOpen(false)
    }, 4000)
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <Dialog open={dialogOpen}>
        <DialogTrigger onClick={() => setDialogOpen(true)}>
          <Plus />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a new PDF</DialogTitle>
            <DialogDescription>
              Process a PDF document to extract accurate bird name counts
            </DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              handleFileChange(e)
            }}
          />

          {isProcessing && <div>Processing file</div>}

          <DialogFooter>
            <Button
              disabled={isProcessing}
              variant={"ghost"}
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>

            <Button
              disabled={!file || (file && isProcessing)}
              onClick={() => processFile()}
            >
              Start Processing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
