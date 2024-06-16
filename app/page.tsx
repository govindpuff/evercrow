import { TypingText } from "@/components/typing-text"

export default async function Home() {
  return (
    <main className="flex flex-col items-center py-96 min-h-dvh">
      <TypingText
        text="Focus on the birdwatching."
        delayBetweenChars={50}
        initialDelay={200}
        className="text-6xl font-semibold text-neutral-700"
      />
      <TypingText
        text="Leave the math to us."
        delayBetweenChars={50}
        initialDelay={2000}
        className="text-6xl font-semibold text-neutral-700"
      />
      <div className="container">
        <div className="bird-container bird-container--one">
          <div className="bird bird--one"></div>
        </div>

        <div className="bird-container bird-container--two">
          <div className="bird bird--two"></div>
        </div>

        <div className="bird-container bird-container--three">
          <div className="bird bird--three"></div>
        </div>

        <div className="bird-container bird-container--four">
          <div className="bird bird--four"></div>
        </div>
      </div>
    </main>
  )
}
