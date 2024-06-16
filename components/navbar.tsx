import Link from "next/link"

function Navbar() {
  return (
    <div className="fixed top-0 max-w-screen-xl w-full h-20 flex items-center justify-between px-2">
      <Link href={"/"}>
        <img src="/evercrow.png" className="h-12" />
      </Link>
      <div className="flex gap-12 items-center font-medium">
        <Link href={"/documents"}>Documents</Link>
      </div>
    </div>
  )
}

export default Navbar
