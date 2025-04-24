"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { UnoCard, WildCard, ReverseCard, SkipCard, ColoredWildCard, PlusFiveCard } from "./components/gameLayout/cards/cardsM"

export default function MobilePopup({ onClose }) {
    const [currentScreen, setCurrentScreen] = useState("main")
    const [page, setPage] = useState(1)
    const totalPages = 4
    const navigate = useNavigate()

    const goToSingle = () => {
        navigate("/single-game")
    }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-sm rounded-3xl bg-[#1789fc] p-6 shadow-lg flex flex-col items-center justify-between animate-in slide-in-from-bottom-10 duration-300"
                style={{ height: "90vh" }}
            >
                <button
                    onClick={() => {
                        if (currentScreen === "main") {
                            onClose()
                        } else {
                            setCurrentScreen("main")
                            setPage(1)
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
                                className="w-full rounded-full border-4 border-black bg-[#f42c04] py-4 px-8 text-center shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Setup</span>
                            </button>

                            <button
                                onClick={() => setCurrentScreen("howto")}
                                className="w-full rounded-full border-4 border-black bg-[#d3940c] py-4 px-8 text-center shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">How to</span>
                            </button>

                            <button
                                onClick={() => setCurrentScreen("betting")}
                                className="w-full rounded-full border-4 border-black bg-[#3e8914] py-4 px-8 text-center shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Betting</span>
                            </button>

                            <button
                                onClick={goToSingle}
                                className="w-full rounded-full border-4 border-black bg-[#a43eed] py-4 px-8 text-center shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                <span className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                  Play a Tutorial
                </span>
                            </button>
                        </>
                    ) : currentScreen === "setup" ? (
                        <SetupScreen />
                    ) : currentScreen === "betting" ? (
                        <BettingScreen />
                    ) : currentScreen === "howto" ? (
                        <HowToScreen page={page} nextPage={nextPage} prevPage={prevPage} totalPages={totalPages} />
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
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%201-HtDpJjV9LX1IiFkUgbX7PfMVX8fR1u.png"
                            alt="Poker chips and coin"
                            className="w-[120px] h-[120px]"
                        />
                    </div>

                    <div className="text-4xl">→</div>

                    <div>
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-s7R4L0Z0qOhw2RMyDlTpExdD5W4xMZ.png"
                            alt="Pot of gold"
                            className="w-[100px] h-[100px]"
                        />
                    </div>
                </div>

                <p className="text-2xl text-center">Win the game to win big!!</p>
            </div>
        </div>
    )
}

function HowToScreen({ page, nextPage, prevPage, totalPages }) {
    return (
        <div className="w-full flex flex-col items-start justify-start gap-6">
            <div className="w-full space-y-8 text-black text-xl font-bold">
                {page === 1 ? (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-6">Color Placing</h2>

                        <div className="flex items-center justify-center gap-4">
                            <UnoCard color="yellow" number="1" className="w-24 h-36" onClick={() => {}} disabled={false} />
                            <div className="text-2xl">←</div>
                            <UnoCard color="yellow" number="3" className="w-24 h-36" onClick={() => {}} disabled={false} />
                        </div>

                        <h2 className="text-3xl font-bold text-black text-center my-4">Number Placing</h2>

                        <div className="flex items-center justify-center gap-4">
                            <UnoCard color="yellow" number="3" className="w-24 h-36" onClick={() => {}} disabled={false} />
                            <div className="text-2xl">←</div>
                            <UnoCard color="blue" number="3" className="w-24 h-36" onClick={() => {}} disabled={false} />
                        </div>
                    </>
                ) : page === 2 ? (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-6">Number Stacking</h2>

                        <div className="flex items-center justify-center gap-2">
                            <div className="relative">
                                <UnoCard color="blue" number="3" className="w-24 h-36 relative z-10" onClick={() => {}} disabled={false} />
                                <UnoCard color="yellow" number="3" className="w-24 h-36 absolute -bottom-4 -left-4" onClick={() => {}} disabled={false} />
                            </div>

                            <div className="text-2xl">→</div>

                            <UnoCard color="yellow" number="3" className="w-24 h-36" onClick={() => {}} disabled={false} />
                        </div>
                    </>
                ) : page === 3 ? (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-6">If Don&apos;t have card to play</h2>

                        <div className="flex items-center justify-center gap-6">
                            <WildCard className="w-24 h-36" onClick={() => {}} disabled={false} />
                            <div className="text-2xl">→</div>
                            <div className="relative">
                                <UnoCard color="blue" number="3" className="w-24 h-36 relative z-10" onClick={() => {}} disabled={false} />
                                <UnoCard color="yellow" number="3" className="w-24 h-36 absolute -bottom-4 -right-4" onClick={() => {}} disabled={false} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-black text-center mb-6">Special Cards</h2>

                        <div className="flex flex-col gap-6">
                            <div className="flex justify-center gap-4">
                                <div className="flex flex-col items-center">
                                    <SkipCard color="red" className="w-16 h-24 mb-1" onClick={() => {}} disabled={false} />
                                    <span className="text-xs font-medium text-center">Skip Next Player</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <PlusFiveCard className="w-16 h-24 mb-1" onClick={() => {}} disabled={false} />
                                    <span className="text-xs font-medium text-center">Next Player draws 5</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <WildCard className="w-16 h-24 mb-1" onClick={() => {}} disabled={false} />
                                    <span className="text-xs font-medium text-center">Swap Current Color</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <div className="flex flex-col items-center">
                                    <ReverseCard color="green" className="w-16 h-24 mb-1" onClick={() => {}} disabled={false} />
                                    <span className="text-xs font-medium text-center">Flip game&apos;s order</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <ColoredWildCard color="blue" className="w-16 h-24 mb-1" onClick={() => {}} disabled={false} />
                                    <span className="text-xs font-medium text-center">Wild card + color</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <button
                    onClick={prevPage}
                    className="rounded-full border-2 border-black bg-transparent p-2"
                    aria-label="Previous page"
                    style={{ visibility: page > 1 ? "visible" : "hidden" }}
                >
                    <ArrowLeft className="h-8 w-8 text-black" />
                </button>
                <button
                    onClick={nextPage}
                    className="rounded-full border-2 border-black bg-transparent p-2"
                    aria-label="Next page"
                    style={{ visibility: page < totalPages ? "visible" : "hidden" }}
                >
                    <ArrowRight className="h-8 w-8 text-black" />
                </button>
            </div>
        </div>
    )
}
