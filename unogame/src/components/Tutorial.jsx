"use client"

import { useState } from "react"
import { X, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import * as Dialog from "@radix-ui/react-dialog"
import { Card } from "./ui/card"
import { useNavigate } from "react-router-dom"
import { UnoCard, WildCard, ReverseCard, SkipCard, PlusFiveCard } from "./gameLayout/cards/cards"

const Tutorial = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const [currentScreenId, setCurrentScreenId] = useState("intro")
    const [currentBranch, setCurrentBranch] = useState("intro")

    const goToTGame = () => {
        navigate("/uno-game")
    }

    const screens = {
        intro: {
            id: "intro",
            title: "Introduction",
            branch: "intro",
            content: (
                <div>
                    <div className="flex flex-col gap-8">
                        <Button
                            className="w-full py-10 text-xl bg-orange-500 hover:bg-orange-600"
                            onClick={() => {
                                setCurrentBranch("setup")
                                setCurrentScreenId("setup")
                            }}
                        >
                            Game&apos;s Setup
                        </Button>
                        <Button
                            className="w-full py-10 text-xl bg-[#FFB30F] hover:bg-[#FFB30F]"
                            onClick={() => {
                                setCurrentBranch("howToPlay")
                                setCurrentScreenId("howToPlay")
                            }}
                        >
                            How to Play
                        </Button>
                        <Button
                            className="w-full py-10 text-xl bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                setCurrentBranch("betting")
                                setCurrentScreenId("betting")
                            }}
                        >
                            Betting rules
                        </Button>
                    </div>
                </div>
            ),
        },
        // Setup Branch
        setup: {
            id: "setup",
            title: "Game Setup",
            branch: "setup",
            next: "placingCards",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">
                        UNO is a card game with cards of consists of four colors (red, blue, green, and yellow), each with numbers 0-9, and special action cards
                    </p>
                    <br/>
                    <p className="text-3xl">
                        Each player is dealt 7 cards with one card set as the starting card.
                    </p>

                    <div className="flex space-x-4 p-4">
                        <UnoCard
                            color="blue"
                            number="9"
                            className="h-36 w-24 p-4"
                        />
                        <UnoCard
                            color="red"
                            number="2"
                            className="h-36 w-24 p-4"
                        />

                        <UnoCard
                            color="green"
                            number="3"
                            className="h-36 w-24 p-4"
                        />

                        <UnoCard
                            color="green"
                            number="4"
                            className="h-36 w-24 p-4"
                        />

                        <div className="flex items-center gap-4">
                            <PlusFiveCard className="h-36 w-24 p-4" />

                        </div>

                        <div className="flex items-center gap-4">
                            <WildCard className="h-36 w-24 p-4" />

                        </div>
                    </div>



                </div>
            ),
        },
        placingCards: {
            id: "placingCards",
            title: "Placing Cards",
            branch: "setup",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">When placing a card, you must follow at least one of these 2 rules:</p>
                    <div className="space-y-6">
                        <div>
                            <p className="text-3xl mb-4">Same Color: A card can be placed on top of a card of the same color</p>
                            <div className="flex items-center justify-center gap-4">
                                <UnoCard color="yellow" number="3" className="h-36 w-24" />
                                <ArrowRight className="h-8 w-8" />
                                <UnoCard color="yellow" number="1" className="h-36 w-24" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl mb-4">Same Number: A card can be placed on top of a card of the same number</p>
                            <div className="flex items-center justify-center gap-4">
                                <UnoCard color="blue" number="3" className="h-36 w-24" />
                                <ArrowRight className="h-8 w-8" />
                                <UnoCard color="yellow" number="3" className="h-36 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            ),
            previous: "setup",
            next: "howToPlay",
        },
        // How to Play Branch
        howToPlay: {
            id: "howToPlay",
            title: "How to Play",
            branch: "howToPlay",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">
                        Players take turns matching a card in their hand to the top card of the discard pile by color or number.
                    </p>
                    <p className="text-3xl">
                        If a player cannot match, they must draw a card. If they can play it, they can; otherwise, their turn is
                        over.
                    </p>
                    <p className="text-3xl">The game continues clockwise unless a Reverse card is played.</p>
                </div>
            ),
            next: "specialCards",
        },
        specialCards: {
            id: "specialCards",
            title: "Special Cards",
            branch: "howToPlay",
            content: (
                <div className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-4">
                            <SkipCard color="red" className="h-36 w-24" />
                            <p className="text-3xl">Skip: Next player loses their turn</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <ReverseCard color="green" className="h-36 w-24" />
                            <p className="text-3xl">Reverse: Reverses the order of play</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <WildCard className="h-36 w-24" />
                            <p className="text-3xl">Wild: Player chooses the next color to be matched</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <PlusFiveCard className="h-36 w-28" />
                            <p className="text-3xl">
                                Wild Draw Five: A wild card, and the next player draws five cards and is Skipped
                            </p>
                        </div>
                    </div>
                </div>
            ),
            previous: "howToPlay",
            next: "unoRules",
        },
        unoRules: {
            id: "unoRules",
            title: "UNO Rules",
            branch: "howToPlay",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">When a player has only one card left, they must call out &quot;UNO!&quot;</p>
                    <p className="text-3xl">
                        If another player catches them not saying &quot;UNO&quot; before the next player begins their turn, the
                        player who didn&apos;t call &quot;UNO&quot; must draw two cards.
                    </p>
                    <p className="text-3xl">The round ends when a player has played all of their cards.</p>
                </div>
            ),
            previous: "specialCards",
            next: "scoring",
        },
        scoring: {
            id: "scoring",
            title: "Scoring and Winning",
            branch: "howToPlay",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">
                        At the end of each round, the winner scores points based on the cards left in their opponents&apos; hands:
                    </p>
                    <ul className="space-y-2 text-2xl list-disc list-inside">
                        <li>Number cards (0-9): Face value</li>
                        <li>Draw Two, Reverse, Skip: 20 points each</li>
                        <li>Wild, Wild Draw Four: 50 points each</li>
                    </ul>
                    <p className="text-3xl mt-4">The first player to reach 500 points wins the game.</p>
                    <p className="text-3xl">
                        Alternatively, you can set a specific number of rounds, and the player with the highest score at the end
                        wins.
                    </p>
                    <Button className="w-full py-8 text-xl bg-green-600 hover:bg-green-700" onClick={goToTGame}>
                        Play A Basic Tutorial
                    </Button>
                </div>
            ),
            previous: "unoRules",
        },
        // Betting Branch
        betting: {
            id: "betting",
            title: "Betting Rules",
            branch: "betting",
            content: (
                <div className="space-y-4">
                    <p className="text-3xl">
                        If you enjoy betting rather than playing the game itself, you can join the spectator booth before a game
                        starts and place bets on your favorite players.
                    </p>
                    <ul className="space-y-2 text-3xl list-disc list-inside">
                        <li>Betting is only available from the spectator booth.</li>
                        <li>Place your bets before the game starts.</li>
                        <li>You cannot place bets once the game has begun.</li>
                        <li>
                            Different betting options may be available, such as predicting the winner or specific in-game events.
                        </li>
                        <li>Make sure to familiarize yourself with the specific betting rules and odds for each game.</li>
                    </ul>
                    <p className="text-3xl mt-4">Remember to gamble responsibly and only bet what you can afford to lose.</p>
                </div>
            ),
        },
    }

    const currentScreen = screens[currentScreenId]

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-[1000px] h-auto bg-blue-500 rounded-3xl overflow-hidden">
                        <div className="p-6 relative min-h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold">{currentScreen.title}</h1>
                                {currentScreenId === "intro" && (
                                    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                                        <X className="h-6 w-6" />
                                    </Button>
                                )}
                                {currentScreenId !== "intro" && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => {
                                            setCurrentBranch("intro")
                                            setCurrentScreenId("intro")
                                        }}
                                    >
                                        <X className="h-6 w-6" />
                                        <span className="sr-only">Return to menu</span>
                                    </Button>
                                )}
                            </div>
                            {currentScreen.content}
                        </div>
                        {currentScreenId !== "intro" && (
                            <div className="flex justify-between px-4 py-2 bg-blue-500">
                                <Button
                                    variant="ghost"
                                    className={`text-white hover:text-white hover:bg-blue-600 ${!currentScreen.previous && "invisible"}`}
                                    onClick={() => currentScreen.previous && setCurrentScreenId(currentScreen.previous)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="ghost"
                                    className={`text-white hover:text-white hover:bg-blue-600 ${!currentScreen.next && "invisible"}`}
                                    onClick={() => currentScreen.next && setCurrentScreenId(currentScreen.next)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </Card>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Tutorial
