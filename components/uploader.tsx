"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"

export default function Uploader() {
  const [file, setFile] = useState<File>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0])
  }

  const processFile = async () => {
    if (!file) {
      toast("Something went wrong!")
      return
    }

    setIsProcessing(true)

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/process-birds", {
      body: formData,
      method: "POST",
    })

    const parsed = await res.json()
    console.log(parsed)
    location.reload()
    setIsProcessing(false)
    setDialogOpen(false)
    setFile(undefined)
  }

  return (
    <div>
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
            disabled={isProcessing}
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
    </div>
  )
}
