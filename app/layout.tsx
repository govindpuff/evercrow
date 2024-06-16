import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Evercrow",
  description: "BIRDS BIRDS BIRDS",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex justify-center relative text-sm`}>
        <div className="max-w-screen-xl w-full relative">
          <Navbar />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
