import Link from "next/link"
import { Button } from "./ui/button"

function Navbar() {
  return (
    <div className="fixed top-0 max-w-screen-xl w-full h-20 flex items-center justify-between px-2">
      <Link href={"/"}>
        <img src="/evercrow.png" className="h-12" />
      </Link>
      <div className="flex gap-12 items-center font-medium">
        <Link href={"/documents"}>
          <Button variant={"ghost"}>Documents</Button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
