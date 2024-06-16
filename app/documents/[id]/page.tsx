import React from "react"

function page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center py-32 px-8">{params.id}</main>
  )
}

export default page
