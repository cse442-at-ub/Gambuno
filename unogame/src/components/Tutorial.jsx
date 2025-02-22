"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

const Tutorial = () => {
    const [currentScreenId, setCurrentScreenId] = useState("intro")
    const [currentBranch, setCurrentBranch] = useState("intro")

    const screens = {
        intro: {
            id: "intro",
            title: "Introduction",
            branch: "intro",
            content: (
                <div className="flex flex-col gap-6">
                    <Button
                        className="w-full py-8 text-xl bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                            setCurrentBranch("setup")
                            setCurrentScreenId("setup")
                        }}
                    >
                        Game's Setup
                    </Button>
                    <Button
                        className="w-full py-8 text-xl bg-[#FFB30F] hover:bg-[#FFB30F]"                        onClick={() => {
                            setCurrentBranch("howToPlay")
                            setCurrentScreenId("howToPlay")
                        }}
                    >
                        How to Play
                    </Button>
                    <Button
                        className="w-full py-8 text-xl bg-red-600 hover:bg-red-700"
                        onClick={() => {
                            setCurrentBranch("betting")
                            setCurrentScreenId("betting")
                        }}
                    >
                        Betting rules
                    </Button>
                </div>
            ),
        },
        // Setup Branch
        setup: {
            id: "setup",
            title: "Game Setup",
            branch: "setup",
            content: (
                <div className="space-y-4">
                    <p className="text-lg">
                        UNO is played with a deck of 108 cards. The deck consists of four colors (red, blue, green, and yellow),
                        each with numbers 0-9, and special action cards.
                    </p>
                    <p className="text-lg">
                        Each player is dealt seven cards. The rest of the deck is placed face down as the draw pile.
                    </p>
                    <p className="text-lg">The top card from the draw pile is turned over to start the discard pile.</p>
                </div>
            ),
            next: "placingCards",
        },
        placingCards: {
            id: "placingCards",
            title: "Placing Cards",
            branch: "setup",
            content: (
                <div className="space-y-4">
                    <p className="text-lg">When placing a card, you must follow at least one of these 2 rules:</p>
                    <div className="space-y-6">
                        <div>
                            <p className="text-lg mb-4">Same Color: A card can be placed on top of a card of the same color</p>
                            <div className="flex items-center justify-center gap-4">
                                <img src="/images/sameColor 1.png" alt="Yellow card with number 3" className="h-24 w-auto" />
                                <img src="/images/arrow-right.png" alt="Right arrow" className="h-8 w-auto" />
                                <img src="/images/sameColor 2.png" alt="Yellow card with number 1" className="h-24 w-auto" />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg mb-4">Same Number: A card can be placed on top of a card of the same number</p>
                            <div className="flex items-center justify-center gap-4">
                                <img src="/images/difColor1.png" alt="Blue card with number 3" className="h-24 w-auto" />
                                <img src="/images/arrow-right.png" alt="Right arrow" className="h-8 w-auto" />
                                <img src="/images/difColor 2.png" alt="Yellow card with number 3" className="h-24 w-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            ),
            previous: "setup",
        },
        // How to Play Branch
        howToPlay: {
            id: "howToPlay",
            title: "How to Play",
            branch: "howToPlay",
            content: (
                <div className="space-y-4">
                    <p className="text-lg">
                        Players take turns matching a card in their hand to the top card of the discard pile by color or number.
                    </p>
                    <p className="text-lg">
                        If a player cannot match, they must draw a card. If they can play it, they can; otherwise, their turn is
                        over.
                    </p>
                    <p className="text-lg">The game continues clockwise unless a Reverse card is played.</p>
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
                            <img src="/images/skip-card.png" alt="Skip card" className="h-24 w-auto" />
                            <p className="text-lg">Skip: Next player loses their turn</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="/images/draw-two-card.png" alt="Draw Two card" className="h-24 w-auto" />
                            <p className="text-lg">Draw Two: Next player draws two cards and loses their turn</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="/images/reverse-card.png" alt="Reverse card" className="h-24 w-auto" />
                            <p className="text-lg">Reverse: Reverses the order of play</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="/images/wild-card.png" alt="Wild card" className="h-24 w-auto" />
                            <p className="text-lg">Wild: Player chooses the next color to be matched</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <img src="/images/plus-four-card.png" alt="Wild Draw Four card" className="h-24 w-auto" />
                            <p className="text-lg">
                                Wild Draw Four: Choose the next color, and the next player draws four cards and loses their turn
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
                    <p className="text-lg">When a player has only one card left, they must call out "UNO!"</p>
                    <p className="text-lg">
                        If another player catches them not saying "UNO" before the next player begins their turn, the player who
                        didn't call "UNO" must draw two cards.
                    </p>
                    <p className="text-lg">The round ends when a player has played all of their cards.</p>
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
                    <p className="text-lg">
                        At the end of each round, the winner scores points based on the cards left in their opponents' hands:
                    </p>
                    <ul className="space-y-2 text-lg list-disc list-inside">
                        <li>Number cards (0-9): Face value</li>
                        <li>Draw Two, Reverse, Skip: 20 points each</li>
                        <li>Wild, Wild Draw Four: 50 points each</li>
                    </ul>
                    <p className="text-lg mt-4">The first player to reach 500 points wins the game.</p>
                    <p className="text-lg">
                        Alternatively, you can set a specific number of rounds, and the player with the highest score at the end
                        wins.
                    </p>
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
                    <p className="text-lg">
                        If you enjoy betting rather than playing the game itself, you can join the spectator booth before a game
                        starts and place bets on your favorite players.
                    </p>
                    <ul className="space-y-2 text-lg list-disc list-inside">
                        <li>Betting is only available from the spectator booth.</li>
                        <li>Place your bets before the game starts.</li>
                        <li>You cannot place bets once the game has begun.</li>
                        <li>
                            Different betting options may be available, such as predicting the winner or specific in-game events.
                        </li>
                        <li>Make sure to familiarize yourself with the specific betting rules and odds for each game.</li>
                    </ul>
                    <p className="text-lg mt-4">Remember to gamble responsibly and only bet what you can afford to lose.</p>
                </div>
            ),
        },
    }

    const currentScreen = screens[currentScreenId]

    return (
        <div className="min-h-screen bg-blue-500 p-4 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden">
                <div className="p-6 relative min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">{currentScreen.title}</h1>
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
        </div>
    )
}

export default Tutorial

