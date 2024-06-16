type ProcessBirdsResultRow = {
  id: string
  filename: string
  filesize: number
  created_at: Date
  updated_at: Date
  status: "processing" | "failed" | "success"
  bird_counts: {
    [birdName: string]: number
  }
}
