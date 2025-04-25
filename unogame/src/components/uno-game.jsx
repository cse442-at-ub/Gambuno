"use client"

import { useState, useEffect } from "react"
import {
    UnoCard,
    WildCard,
    CardBack,
    ColorPicker,
    ReverseCard,
    SkipCard,
    PlusFiveCard,
    ColoredWildCard,
    ColoredPlusFiveCard,
} from "./gameLayout/cards/cards"

export default function UnoGame() {
    // Map colors to their respective hex color values
    const colorHexMap = {
        red: "#F42C04",
        blue: "#1789FC",
        yellow: "#FFB30F",
        green: "#3E8914",
    }

    // CSS-in-JS styles to ensure the game works without Tailwind
    const styles = {
        container: {
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #1a202c, #2d3748)",
            color: "white",
            padding: "1rem",
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        },
        title: {
            fontSize: "1.875rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1.5rem",
        },
        winnerContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
        },
        winnerText: {
            fontSize: "2.25rem",
            fontWeight: "bold",
            color: "#fbbf24",
        },
        playAgainButton: {
            padding: "0.75rem 1.5rem",
            backgroundColor: "#059669",
            color: "white",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.125rem",
            cursor: "pointer",
            border: "none",
            transition: "background-color 0.2s",
        },
        gameContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        gameContent: {
            width: "100%",
            maxWidth: "64rem",
        },
        statusBar: {
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            marginBottom: "1rem",
            textAlign: "center",
        },
        statusText: {
            fontSize: "1.25rem",
            fontWeight: "600",
        },
        botTurnText: {
            marginLeft: "0.5rem",
            color: "#fbbf24",
        },
        colorText: {
            fontSize: "0.875rem",
            color: "#9ca3af",
        },
        botGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "1.5rem",
        },
        botCard: {
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        botTitle: {
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
        },
        botCardContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.25rem",
        },
        cardCount: {
            marginTop: "0.5rem",
            fontSize: "0.875rem",
        },
        playArea: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2rem",
        },
        drawPileContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        drawButton: {
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "0.5rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
        },
        disabledButton: {
            opacity: "0.5",
            cursor: "not-allowed",
        },
        playedPileContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        playerHandContainer: {
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            padding: "1rem",
        },
        playerHandTitle: {
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
        },
        playerCards: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
        },
        colorPickerOverlay: {
            position: "fixed",
            inset: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "50",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        colorPickerContainer: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "2px solid white",
            maxWidth: "20rem",
            width: "100%",
        },
        colorPickerHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
        },
        colorPickerTitle: {
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
        },
        closeButton: {
            color: "white",
            cursor: "pointer",
            background: "none",
            border: "none",
        },
        colorGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
        },
        colorButton: {
            width: "100%",
            height: "5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transform: "scale(1)",
            transition: "transform 0.2s",
            border: "4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        },
        colorButtonText: {
            fontWeight: "bold",
            fontSize: "1.125rem",
        },
        // Star styles
        star: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
    }

    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState(null)
    const [playerDeck, setPlayerDeck] = useState([])
    const [botDecks, setBotDecks] = useState([[], [], []]) // 3 bots
    const [playedPile, setPlayedPile] = useState([])
    const [currentNumber, setCurrentNumber] = useState("")
    const [currentColor, setCurrentColor] = useState("")
    const [drawCardPile, setDrawCardPile] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState(0) // 0 = human, 1-3 = bots
    const [gameMessage, setGameMessage] = useState("Your turn")
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [lastPlayedWild, setLastPlayedWild] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("resize", checkMobile)
        }
    }, [])

    // Card mapping for display
    const getCardDetails = (card) => {
        if (!card) return { type: null, color: null, number: null }

        if (card === "W") {
            return { type: "wild", color: null, number: null }
        }

        if (card === "P5") {
            return { type: "plus5", color: null, number: null }
        }

        const number = card[0]
        const colorCode = card[1]

        const colorMap = {
            R: "red",
            G: "green",
            B: "blue",
            Y: "yellow",
        }

        // Check for special cards
        if (number === "S") {
            return { type: "skip", color: colorMap[colorCode], number: null }
        }

        if (number === "R") {
            return { type: "reverse", color: colorMap[colorCode], number: null }
        }

        return {
            type: "number",
            color: colorMap[colorCode],
            number: number,
        }
    }

    // Deck initialization
    const DECK = [
        "0R",
        "1R",
        "1R",
        "2R",
        "2R",
        "3R",
        "3R",
        "4R",
        "4R",
        "5R",
        "5R",
        "6R",
        "6R",
        "7R",
        "7R",
        "8R",
        "8R",
        "9R",
        "9R",
        "SR",
        "SR",
        "RR",
        "RR",
        "0G",
        "1G",
        "1G",
        "2G",
        "2G",
        "3G",
        "3G",
        "4G",
        "4G",
        "5G",
        "5G",
        "6G",
        "6G",
        "7G",
        "7G",
        "8G",
        "8G",
        "9G",
        "9G",
        "SG",
        "SG",
        "RG",
        "RG",
        "0B",
        "1B",
        "1B",
        "2B",
        "2B",
        "3B",
        "3B",
        "4B",
        "4B",
        "5B",
        "5B",
        "6B",
        "6B",
        "7B",
        "7B",
        "8B",
        "8B",
        "9B",
        "9B",
        "SB",
        "SB",
        "RB",
        "RB",
        "0Y",
        "1Y",
        "1Y",
        "2Y",
        "2Y",
        "3Y",
        "3Y",
        "4Y",
        "4Y",
        "5Y",
        "5Y",
        "6Y",
        "6Y",
        "7Y",
        "7Y",
        "8Y",
        "8Y",
        "9Y",
        "9Y",
        "SY",
        "SY",
        "RY",
        "RY",
        "W",
        "W",
        "W",
        "W",
        "P5",
        "P5",
        "P5",
        "P5",
    ]

    // Function to shuffle an array
    const shuffleDeck = (deck) => {
        return [...deck].sort(() => Math.random() - 0.5)
    }

    // Initialize game
    useEffect(() => {
        const shuffledDeck = shuffleDeck(DECK)

        // Deal 7 cards to each player
        const playerStartingHand = shuffledDeck.splice(0, 7)
        const bot1StartingHand = shuffledDeck.splice(0, 7)
        const bot2StartingHand = shuffledDeck.splice(0, 7)
        const bot3StartingHand = shuffledDeck.splice(0, 7)

        // Extract 1 card for played pile
        let initialCard = shuffledDeck.shift()
        while (initialCard === "W" || initialCard === "P5") {
            shuffledDeck.push(initialCard)
            initialCard = shuffledDeck.shift()
        }

        // Set game state
        setPlayerDeck(playerStartingHand)
        setBotDecks([bot1StartingHand, bot2StartingHand, bot3StartingHand])
        setPlayedPile([initialCard])
        setDrawCardPile(shuffledDeck)

        // Extract color and number from initial card
        const initialCardDetails = getCardDetails(initialCard)
        setCurrentColor(initialCardDetails.color)
        setCurrentNumber(initialCardDetails.number)

        setGameOver(false)
        setCurrentPlayer(0) // Human starts first
    }, [])

    // Handle wild card color selection
    const handleColorSelect = (color) => {
        setCurrentColor(color)
        setShowColorPicker(false)
        setLastPlayedWild(false)

        // Move to next player after color selection
        setCurrentPlayer((currentPlayer + 1) % 4)
    }

    // Bot turn logic
    useEffect(() => {
        if (currentPlayer === 0 || gameOver || lastPlayedWild) return

        const botTurn = setTimeout(() => {
            const botIndex = currentPlayer - 1
            const botDeck = [...botDecks[botIndex]]

            // Find playable cards
            const playableCards = botDeck.filter((card) => {
                if (card === "W" || card === "P5") return true

                const cardDetails = getCardDetails(card)
                return cardDetails.number === currentNumber || cardDetails.color === currentColor
            })

            if (playableCards.length > 0) {
                // Bot plays a random playable card
                const playedCard = playableCards[Math.floor(Math.random() * playableCards.length)]
                const playedCardDetails = getCardDetails(playedCard)

                // Update game state
                const newBotDecks = [...botDecks]
                newBotDecks[botIndex] = botDeck.filter((card) => card !== playedCard)
                setBotDecks(newBotDecks)

                // Add to played pile
                setPlayedPile((prev) => [playedCard, ...prev])

                // Handle special cards
                if (playedCard === "W") {
                    // Bot chooses a random color
                    const colors = ["red", "blue", "green", "yellow"]
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]
                    setCurrentColor(randomColor)
                    setGameMessage(`Bot ${currentPlayer} played Wild and chose ${randomColor}`)
                } else if (playedCard === "P5") {
                    // Bot chooses a random color for +5
                    const colors = ["red", "blue", "green", "yellow"]
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]
                    setCurrentColor(randomColor)

                    // Next player draws 5 cards
                    const nextPlayer = (currentPlayer + 1) % 4
                    if (nextPlayer === 0) {
                        // Player draws 5 cards
                        const newCards = drawCardPile.slice(0, 5)
                        const newDrawPile = drawCardPile.slice(5)
                        setPlayerDeck([...playerDeck, ...newCards])
                        setDrawCardPile(newDrawPile)
                    } else {
                        // Bot draws 5 cards
                        const nextBotIndex = nextPlayer - 1
                        const newCards = drawCardPile.slice(0, 5)
                        const newDrawPile = drawCardPile.slice(5)

                        const newBotDecks = [...botDecks]
                        newBotDecks[nextBotIndex] = [...botDecks[nextBotIndex], ...newCards]
                        setBotDecks(newBotDecks)
                        setDrawCardPile(newDrawPile)
                    }

                    setGameMessage(`Bot ${currentPlayer} played +5 and chose ${randomColor}`)

                    // Skip the next player
                    setCurrentPlayer((currentPlayer + 2) % 4)
                    return
                } else {
                    // Update current card properties
                    setCurrentNumber(playedCardDetails.number)
                    setCurrentColor(playedCardDetails.color)
                    setGameMessage(
                        `Bot ${currentPlayer} played ${playedCardDetails.number || playedCardDetails.type} ${playedCardDetails.color}`,
                    )
                }

                // Check if bot won
                if (newBotDecks[botIndex].length === 0) {
                    setGameOver(true)
                    setWinner(`Bot ${currentPlayer}`)
                    return
                }
            } else {
                // Bot draws a card if no playable cards
                if (drawCardPile.length > 0) {
                    const newCard = drawCardPile[0]
                    const newDrawPile = drawCardPile.slice(1)

                    const newBotDecks = [...botDecks]
                    newBotDecks[botIndex] = [...botDeck, newCard]

                    setBotDecks(newBotDecks)
                    setDrawCardPile(newDrawPile)
                    setGameMessage(`Bot ${currentPlayer} drew a card`)
                }
            }

            // Move to next player
            setCurrentPlayer((currentPlayer + 1) % 4)
        }, 1500) // 1.5 second delay for bot moves

        return () => clearTimeout(botTurn)
    }, [currentPlayer, currentColor, currentNumber, gameOver, lastPlayedWild])

    // Player plays a card
    const playCard = (cardIndex) => {
        if (currentPlayer !== 0 || gameOver || lastPlayedWild) return

        const card = playerDeck[cardIndex]
        const cardDetails = getCardDetails(card)

        // Check if the card is playable
        const isWild = card === "W" || card === "P5"
        const isPlayable = isWild || cardDetails.number === currentNumber || cardDetails.color === currentColor

        if (isPlayable) {
            // Remove card from player's hand
            const newPlayerDeck = [...playerDeck]
            newPlayerDeck.splice(cardIndex, 1)
            setPlayerDeck(newPlayerDeck)

            // Add card to played pile
            setPlayedPile([card, ...playedPile])

            // Handle special cards
            if (card === "W") {
                setLastPlayedWild(true)
                setShowColorPicker(true)
                setGameMessage("Choose a color")
            } else if (card === "P5") {
                setLastPlayedWild(true)
                setShowColorPicker(true)
                setGameMessage("Choose a color for +5")

                // Bot 1 draws 5 cards
                const newCards = drawCardPile.slice(0, 5)
                const newDrawPile = drawCardPile.slice(5)

                const newBotDecks = [...botDecks]
                newBotDecks[0] = [...botDecks[0], ...newCards]
                setBotDecks(newBotDecks)
                setDrawCardPile(newDrawPile)

                // After color selection, we'll skip Bot 1
                // This is handled in handleColorSelect
            } else {
                // Update current card properties
                setCurrentNumber(cardDetails.number)
                setCurrentColor(cardDetails.color)
                setGameMessage(`You played ${cardDetails.number || cardDetails.type} ${cardDetails.color}`)

                // Move to next player
                setCurrentPlayer(1)
            }

            // Check if player won
            if (newPlayerDeck.length === 0) {
                setGameOver(true)
                setWinner("You")
            }
        }
    }

    // Draw a card
    const drawCard = () => {
        if (currentPlayer !== 0 || gameOver || lastPlayedWild || drawCardPile.length === 0) return

        const newCard = drawCardPile[0]
        const newDrawPile = drawCardPile.slice(1)

        setPlayerDeck([...playerDeck, newCard])
        setDrawCardPile(newDrawPile)
        setGameMessage("You drew a card")

        // Move to next player
        setCurrentPlayer(1)
    }

    // Restart game
    const restartGame = () => {
        const shuffledDeck = shuffleDeck(DECK)

        // Deal 7 cards to each player
        const playerStartingHand = shuffledDeck.splice(0, 7)
        const bot1StartingHand = shuffledDeck.splice(0, 7)
        const bot2StartingHand = shuffledDeck.splice(0, 7)
        const bot3StartingHand = shuffledDeck.splice(0, 7)

        // Extract 1 card for played pile
        let initialCard = shuffledDeck.shift()
        while (initialCard === "W" || initialCard === "P5") {
            shuffledDeck.push(initialCard)
            initialCard = shuffledDeck.shift()
        }

        // Set game state
        setPlayerDeck(playerStartingHand)
        setBotDecks([bot1StartingHand, bot2StartingHand, bot3StartingHand])
        setPlayedPile([initialCard])
        setDrawCardPile(shuffledDeck)

        // Extract color and number from initial card
        const initialCardDetails = getCardDetails(initialCard)
        setCurrentColor(initialCardDetails.color)
        setCurrentNumber(initialCardDetails.number)

        setGameOver(false)
        setWinner(null)
        setCurrentPlayer(0)
        setGameMessage("Your turn")
        setShowColorPicker(false)
        setLastPlayedWild(false)
    }

    // Render the top card from the played pile
    const renderTopCard = () => {
        if (playedPile.length === 0) return null

        const topCard = playedPile[0]
        const cardDetails = getCardDetails(topCard)
        const cardSize = isMobile ? "w-16 h-24" : "w-20 h-28 sm:w-24 sm:h-36"

        if (cardDetails.type === "wild") {
            return currentColor ? (
                <ColoredWildCard color={currentColor} className={cardSize} disabled={true} onClick={() => {}} />
            ) : (
                <WildCard className={cardSize} disabled={true} onClick={() => {}} />
            )
        } else if (cardDetails.type === "plus5") {
            return currentColor ? (
                <ColoredPlusFiveCard color={currentColor} className={cardSize} disabled={true} onClick={() => {}} />
            ) : (
                <PlusFiveCard className={cardSize} disabled={true} onClick={() => {}} />
            )
        } else if (cardDetails.type === "reverse") {
            return <ReverseCard color={cardDetails.color} className={cardSize} disabled={true} onClick={() => {}} />
        } else if (cardDetails.type === "skip") {
            return <SkipCard color={cardDetails.color} className={cardSize} disabled={true} onClick={() => {}} />
        } else {
            return <UnoCard color={cardDetails.color} number={cardDetails.number} className={cardSize} disabled={true} onClick={() => {}} />
        }
    }

    // Render player card
    const renderPlayerCard = (card, index) => {
        const cardDetails = getCardDetails(card)
        const isDisabled = currentPlayer !== 0 || gameOver || lastPlayedWild
        const cardSize = isMobile ? "w-14 h-20" : "w-16 h-24 sm:w-20 sm:h-28"

        if (cardDetails.type === "wild") {
            return <WildCard key={index} className={cardSize} onClick={() => playCard(index)} disabled={isDisabled} />
        } else if (cardDetails.type === "plus5") {
            return <PlusFiveCard key={index} className={cardSize} onClick={() => playCard(index)} disabled={isDisabled} />
        } else if (cardDetails.type === "reverse") {
            return (
                <ReverseCard
                    key={index}
                    color={cardDetails.color}
                    className={cardSize}
                    onClick={() => playCard(index)}
                    disabled={isDisabled}
                />
            )
        } else if (cardDetails.type === "skip") {
            return (
                <SkipCard
                    key={index}
                    color={cardDetails.color}
                    className={cardSize}
                    onClick={() => playCard(index)}
                    disabled={isDisabled}
                />
            )
        } else {
            return (
                <UnoCard
                    key={index}
                    color={cardDetails.color}
                    number={cardDetails.number}
                    className={cardSize}
                    onClick={() => playCard(index)}
                    disabled={isDisabled}
                />
            )
        }
    }

    return (
        <div className="min-h-screen bg-[#0a5c36] text-white p-2 sm:p-4 font-sans">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-yellow-300 drop-shadow-md">
                UNO Game
            </h1>

            {gameOver ? (
                <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 drop-shadow-lg">{winner} won!</h2>
                    <button
                        onClick={restartGame}
                        className="px-4 py-2 sm:px-6 sm:py-3 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 rounded-lg font-bold text-base sm:text-lg transition-colors shadow-lg"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-4xl">
                        {/* Game status */}
                        <div className="bg-[#074428] rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-center shadow-md">
                            <h2 className="text-lg sm:text-xl font-semibold">
                                {gameMessage}
                                {currentPlayer > 0 && <span className="ml-2 text-yellow-300">(Bot {currentPlayer}'s turn)</span>}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300">
                                Current color:{" "}
                                <span
                                    className="font-bold"
                                    style={{
                                        color: colorHexMap[currentColor],
                                        fontWeight: "bold",
                                    }}
                                >
                  {currentColor}
                </span>
                            </p>
                        </div>

                        {/* Bot cards */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                            {botDecks.map((deck, index) => (
                                <div key={index} className="bg-[#074428] rounded-lg p-2 sm:p-3 flex flex-col items-center shadow-md">
                                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Bot {index + 1}</h3>
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {Array(Math.min(deck.length, isMobile ? 3 : 5))
                                            .fill(0)
                                            .map((_, i) => (
                                                <CardBack key={i} isDark={true} className="w-6 h-9 sm:w-10 sm:h-14" isPile={false} onClick={() => {}} />
                                            ))}
                                    </div>
                                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm">{deck.length} cards</p>
                                </div>
                            ))}
                        </div>

                        {/* Play area */}
                        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-4 sm:mb-8">
                            {/* Draw pile */}
                            <div className="flex flex-col items-center">
                                <CardBack isDark={true} isPile={true} className="w-16 h-24 sm:w-20 sm:h-28 mb-1 sm:mb-2" onClick={drawCard} />
                                <p className="text-xs sm:text-sm">{drawCardPile.length} cards</p>
                                <button
                                    onClick={drawCard}
                                    disabled={currentPlayer !== 0 || gameOver || lastPlayedWild}
                                    className="mt-1 sm:mt-2 px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm sm:text-base"
                                >
                                    Draw
                                </button>
                            </div>

                            {/* Played pile */}
                            <div className="flex flex-col items-center">
                                <div className="relative">{renderTopCard()}</div>
                                <p className="text-xs sm:text-sm mt-1 sm:mt-2">Played pile</p>
                            </div>
                        </div>

                        {/* Player's hand */}
                        <div className="bg-[#074428] rounded-lg p-3 sm:p-4 shadow-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Your Cards ({playerDeck.length})</h3>
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                {playerDeck.map((card, index) => renderPlayerCard(card, index))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Color picker modal */}
            {showColorPicker && <ColorPicker onSelectColor={handleColorSelect} onClose={() => setShowColorPicker(false)} />}
        </div>
    )
}