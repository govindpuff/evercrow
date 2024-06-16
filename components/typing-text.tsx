"use client"

import { ComponentProps, useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

type Props = {
  text: string
  delayBetweenChars?: number
  initialDelay?: number
  persistCaret?: boolean
  className?: ComponentProps<"div">["className"]
}

export const TypingText: React.FC<Props> = ({
  text,
  delayBetweenChars = 100,
  initialDelay = 0,
  persistCaret = false,
  className = "",
}) => {
  const container = useRef<HTMLDivElement>(null)
  const [chars, setChars] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = []
    const initialTimeout = setTimeout(() => {
      setIsTyping(true)
      text.split("").forEach((char, index) => {
        let timeout = setTimeout(() => {
          setChars((current) => current + char)

          if (index === text.length - 1 && !persistCaret) {
            setIsTyping(false)
          }
        }, index * delayBetweenChars)
        timeouts.push(timeout)
      })
    }, initialDelay)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      clearTimeout(initialTimeout)
    }
  }, [text, delayBetweenChars, initialDelay])

  return (
    <div ref={container} className={cn("text-lg", className)}>
      {chars}
      {isTyping && (
        <span id="caret" className="animate-blink">
          |
        </span>
      )}
    </div>
  )
}
