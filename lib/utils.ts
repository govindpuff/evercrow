import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBase64 = async (file: File) =>
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const formatFileSize = (numBytes: number) => {
  const sizeFormatter = new Intl.NumberFormat([], {
    style: "unit",
    unit: "byte",
    notation: "compact",
    unitDisplay: "narrow",
  })
  return sizeFormatter.format(numBytes)
}
