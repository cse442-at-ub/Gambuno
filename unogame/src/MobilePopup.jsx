"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function MobilePopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [currentScreen, setCurrentScreen] = useState("main")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#1789fc] p-6 shadow-lg flex flex-col items-center justify-between"
        style={{ height: "90vh" }}
      >
        <button
          onClick={() => {
            if (currentScreen === "main") {
              setIsOpen(false)
            } else {
              setCurrentScreen("main")
            }
          }}
          className="absolute right-6 top-6 rounded-full border-2 border-black bg-transparent p-1.5"
          aria-label="Close popup"
        >
          <X className="h-7 w-7 text-black" />
        </button>

        <div className="w-full flex-grow flex flex-col items-center justify-center gap-8">
          {currentScreen === "main" ? (
            <>
              <button
                onClick={() => setCurrentScreen("setup")}
                className="w-full rounded-full border-4 border-black bg-[#f42c04] py-4 px-8 text-center shadow-md"
              >
                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Setup</span>
              </button>

              <button
                onClick={() => setCurrentScreen("howto")}
                className="w-full rounded-full border-4 border-black bg-[#d3940c] py-4 px-8 text-center shadow-md"
              >
                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">How to</span>
              </button>

              <button
                onClick={() => setCurrentScreen("betting")}
                className="w-full rounded-full border-4 border-black bg-[#3e8914] py-4 px-8 text-center shadow-md"
              >
                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Betting</span>
              </button>
            </>
          ) : currentScreen === "setup" ? (
            <SetupScreen />
          ) : currentScreen === "betting" ? (
            <BettingScreen />
          ) : currentScreen === "howto" ? (
            <HowToScreen />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function SetupScreen() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] self-center">Setup</h2>

      <div className="w-full space-y-6 text-black text-xl font-bold">
        <p>Deck: 108 Cards</p>

        <p>Cards: 4 colors, 0-9 or special card</p>

        <p>Start with 7 Cards</p>

        <div>
          <p className="mb-4">Card colors:</p>
          <div className="flex justify-between items-center gap-2">
            <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#3e8914]"></div>
            <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#d3940c]"></div>
            <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#1789fc]"></div>
            <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#f42c04]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BettingScreen() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] self-center">Betting</h2>

      <div className="w-full space-y-8 text-black text-xl font-bold">
        <p className="text-2xl">Place bet before match</p>

        <div className="flex items-center justify-center gap-4 py-4">
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%201-HtDpJjV9LX1IiFkUgbX7PfMVX8fR1u.png"
              alt="Poker chips and coin"
              width={120}
              height={120}
            />
          </div>

          <div className="text-4xl">→</div>

          <div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-s7R4L0Z0qOhw2RMyDlTpExdD5W4xMZ.png"
              alt="Pot of gold"
              width={100}
              height={100}
            />
          </div>
        </div>

        <p className="text-2xl text-center">Win the game to win big!!</p>
      </div>
    </div>
  )
}

function HowToScreen() {
  const [page, setPage] = useState(1)
  const totalPages = 4

  const nextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1)
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1)
    }
  }

  return (
    <div className="w-full flex flex-col items-start justify-start gap-6">
      <div className="w-full space-y-8 text-black text-xl font-bold">
        {page === 1 ? (
          <>
            <h2 className="text-3xl font-bold text-black text-center mb-6">Color Placing</h2>

            <div className="flex items-center justify-center gap-4">
              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%205-jmSHaqTsDzmlPqxHfWk2cycuaybCft.png"
                  alt="Yellow 1 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>

              <div className="text-2xl">←</div>

              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%207-XPlpWVm8kGMcRo19Kq5uDudJZewGCX.png"
                  alt="Yellow 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-black text-center my-4">Number Placing</h2>

            <div className="flex items-center justify-center gap-4">
              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%206-OND6IFFWIo5d5BK3fBXbP3FmK9n1jx.png"
                  alt="Yellow 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>

              <div className="text-2xl">←</div>

              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%204-mj6G3V8UkQM7YYhqgrkc3clQhdmAEu.png"
                  alt="Blue 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>
            </div>
          </>
        ) : page === 2 ? (
          <>
            <h2 className="text-3xl font-bold text-black text-center mb-6">Number Stacking</h2>

            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%204-mj6G3V8UkQM7YYhqgrkc3clQhdmAEu.png"
                  alt="Blue 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto relative z-10"
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%206-OND6IFFWIo5d5BK3fBXbP3FmK9n1jx.png"
                  alt="Yellow 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto absolute -bottom-4 -left-4"
                />
              </div>

              <div className="text-2xl">→</div>

              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%207-XPlpWVm8kGMcRo19Kq5uDudJZewGCX.png"
                  alt="Yellow 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>
            </div>
          </>
        ) : page === 3 ? (
          <>
            <h2 className="text-3xl font-bold text-black text-center mb-6">If Don't have card to play</h2>

            <div className="flex items-center justify-center gap-6">
              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%201-I7HKVCwyEs17USCb9CxaZiXC1zRmY0.png"
                  alt="Wild card"
                  width={80}
                  height={120}
                  className="w-20 h-auto"
                />
              </div>

              <div className="text-2xl">→</div>

              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%204-mj6G3V8UkQM7YYhqgrkc3clQhdmAEu.png"
                  alt="Blue 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto relative z-10"
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8671%206-OND6IFFWIo5d5BK3fBXbP3FmK9n1jx.png"
                  alt="Yellow 3 card"
                  width={80}
                  height={120}
                  className="w-20 h-auto absolute -bottom-4 -right-4"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-black text-center mb-6">Special Cards</h2>

            <div className="flex flex-col gap-6">
              {/* Top row - 3 cards */}
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%206.34.49%E2%80%AFPM%201-u6Zg1CsPGpTa7L9VtbqZMNikpWDE7y.png"
                    alt="Skip card"
                    width={50}
                    height={75}
                    className="w-12 h-auto mb-1"
                  />
                  <span className="text-xs font-medium text-center">Skip Next Player</span>
                </div>

                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%206.32.23%E2%80%AFPM%201-rinkXBTWRibRK0LiY3uJFYZVvdaV8A.png"
                    alt="Draw 2 card"
                    width={50}
                    height={75}
                    className="w-12 h-auto mb-1"
                  />
                  <span className="text-xs font-medium text-center">Next Player draws 2</span>
                </div>

                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%206.39.51%E2%80%AFPM%201-P6caDDP3gQ4ZdL4JdULUUrtL45leVI.png"
                    alt="Wild card"
                    width={50}
                    height={75}
                    className="w-12 h-auto mb-1"
                  />
                  <span className="text-xs font-medium text-center">Swap Current Color</span>
                </div>
              </div>

              {/* Bottom row - 2 cards */}
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%206.35.42%E2%80%AFPM%201-EZeSUv0vdZm5BSinCmMDAyNAX7sqpq.png"
                    alt="Reverse card"
                    width={50}
                    height={75}
                    className="w-12 h-auto mb-1"
                  />
                  <span className="text-xs font-medium text-center">Flip game's order</span>
                </div>

                <div className="flex flex-col items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%206.44.03%E2%80%AFPM%201-I4Ax8YUtjf1TbYv6ZYHO2RQPHgQjoC.png"
                    alt="Draw 4 Wild card"
                    width={50}
                    height={75}
                    className="w-12 h-auto mb-1"
                  />
                  <span className="text-xs font-medium text-center">Wild card + 2 plus 2's</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        <button
          onClick={prevPage}
          className="rounded-full border-2 border-black bg-transparent p-1"
          aria-label="Previous page"
          style={{ visibility: page > 1 ? "visible" : "hidden" }}
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </button>
        <button
          onClick={nextPage}
          className="rounded-full border-2 border-black bg-transparent p-1"
          aria-label="Next page"
          style={{ visibility: page < totalPages ? "visible" : "hidden" }}
        >
          <ArrowRight className="h-6 w-6 text-black" />
        </button>
      </div>
    </div>
  )
}

