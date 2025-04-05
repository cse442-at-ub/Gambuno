"use client"

import { useState, useEffect } from "react"
// Import Star icon from Material-UI
import StarIcon from "@mui/icons-material/Star"

export default function UnoGame() {
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

    // Card mapping for display
    const getCardDetails = (card) => {
        if (!card) return { type: null, color: null, number: null }

        if (card === "W") {
            return { type: "wild", color: null, number: null }
        }

        const number = card[0]
        const colorCode = card[1]

        const colorMap = {
            R: "red",
            G: "green",
            B: "blue",
            Y: "yellow",
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
        "W",
        "W",
        "W",
        "W",
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
        while (initialCard === "W") {
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
                if (card === "W") return true

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

                // Handle wild card
                if (playedCard === "W") {
                    // Bot chooses a random color
                    const colors = ["red", "blue", "green", "yellow"]
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]
                    setCurrentColor(randomColor)
                    setGameMessage(`Bot ${currentPlayer} played Wild and chose ${randomColor}`)
                } else {
                    // Update current card properties
                    setCurrentNumber(playedCardDetails.number)
                    setCurrentColor(playedCardDetails.color)
                    setGameMessage(`Bot ${currentPlayer} played ${playedCardDetails.number} ${playedCardDetails.color}`)
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
        const isWild = card === "W"
        const isPlayable = isWild || cardDetails.number === currentNumber || cardDetails.color === currentColor

        if (isPlayable) {
            // Remove card from player's hand
            const newPlayerDeck = [...playerDeck]
            newPlayerDeck.splice(cardIndex, 1)
            setPlayerDeck(newPlayerDeck)

            // Add card to played pile
            setPlayedPile([card, ...playedPile])

            // Handle wild card
            if (isWild) {
                setLastPlayedWild(true)
                setShowColorPicker(true)
                setGameMessage("Choose a color")
            } else {
                // Update current card properties
                setCurrentNumber(cardDetails.number)
                setCurrentColor(cardDetails.color)
                setGameMessage(`You played ${cardDetails.number} ${cardDetails.color}`)

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
        while (initialCard === "W") {
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

    // Card Components
    function UnoCard({ color, number, className, onClick, disabled }) {
        // Map colors to their respective hex color values
        const colorHexMap = {
            red: "#F42C04",
            blue: "#1789FC",
            yellow: "#FFB30F",
            green: "#3E8914",
        }

        // Create an array of positions for the stars in a circle
        const starPositions = [
            { top: "10%", left: "50%", transform: "translate(-50%, 0) rotate(0deg)" },
            { top: "15%", left: "75%", transform: "translate(-50%, 0) rotate(45deg)" },
            { top: "30%", left: "90%", transform: "translate(-50%, 0) rotate(90deg)" },
            { top: "50%", left: "95%", transform: "translate(-50%, -50%) rotate(135deg)" },
            { top: "70%", left: "90%", transform: "translate(-50%, -100%) rotate(180deg)" },
            { top: "85%", left: "75%", transform: "translate(-50%, -100%) rotate(225deg)" },
            { top: "90%", left: "50%", transform: "translate(-50%, -100%) rotate(270deg)" },
            { top: "85%", left: "25%", transform: "translate(-50%, -100%) rotate(315deg)" },
            { top: "70%", left: "10%", transform: "translate(-50%, -100%) rotate(0deg)" },
            { top: "50%", left: "5%", transform: "translate(-50%, -50%) rotate(45deg)" },
            { top: "30%", left: "10%", transform: "translate(-50%, 0) rotate(90deg)" },
            { top: "15%", left: "25%", transform: "translate(-50%, 0) rotate(135deg)" },
        ]

        // Card styles
        const cardStyles = {
            button: {
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s",
                cursor: disabled ? "not-allowed" : "pointer",
                width: className?.includes("w-20") ? "5rem" : className?.includes("w-16") ? "4rem" : "5rem",
                height: className?.includes("h-28") ? "7rem" : className?.includes("h-24") ? "6rem" : "7rem",
            },
            outerBorder: {
                position: "absolute",
                inset: "0",
                backgroundColor: "black",
                borderRadius: "0.5rem",
            },
            innerCard: {
                position: "absolute",
                inset: "4px",
                backgroundColor: "#fffffb",
                borderRadius: "0.375rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            },
            topLeftNumber: {
                position: "absolute",
                top: "0.25rem",
                left: "0.25rem",
                zIndex: "10",
            },
            bottomRightNumber: {
                position: "absolute",
                bottom: "0.25rem",
                right: "0.25rem",
                zIndex: "10",
            },
            numberText: {
                color: colorHexMap[color],
                fontSize: "clamp(0.8rem, 2vw, 1.5rem)",
                textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                fontWeight: "900",
            },
            starsContainer: {
                position: "absolute",
                width: "92%",
                height: "86.25%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            },
            centerNumber: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "10",
                color: colorHexMap[color],
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                textShadow: "0 0 3px rgba(255, 255, 255, 0.9)",
                fontWeight: "900",
            },
            star: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
            },
        }

        return (
            <button
                className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={onClick}
                disabled={disabled}
                type="button"
                style={cardStyles.button}
            >
                {/* Card background with thicker border */}
                <div className="absolute inset-0 bg-black rounded-lg" style={cardStyles.outerBorder}>
                    <div
                        className="absolute inset-[4px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center"
                        style={cardStyles.innerCard}
                    >
                        {/* Number in top left - improved visibility */}
                        <div className="absolute top-1 left-1 z-10" style={cardStyles.topLeftNumber}>
              <span style={cardStyles.numberText} className="font-bold">
                {number}
              </span>
                        </div>

                        {/* Number in bottom right - improved visibility */}
                        <div className="absolute bottom-1 right-1 z-10" style={cardStyles.bottomRightNumber}>
              <span style={cardStyles.numberText} className="font-bold">
                {number}
              </span>
                        </div>

                        {/* Ring of stars around the number */}
                        <div className="absolute" style={cardStyles.starsContainer}>
                            {/* Stars around the number */}
                            {starPositions.map((position, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...cardStyles.star,
                                        top: position.top,
                                        left: position.left,
                                        transform: position.transform,
                                    }}
                                >
                                    <StarIcon
                                        style={{
                                            color: colorHexMap[color],
                                            fontSize: "0.75rem",
                                        }}
                                    />
                                </div>
                            ))}

                            {/* Center number - improved visibility */}
                            <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                                style={cardStyles.centerNumber}
                            >
                <span
                    style={{
                        color: colorHexMap[color],
                        fontSize: "clamp(1.5rem, 4vw, 3rem)",
                        textShadow: "0 0 3px rgba(255, 255, 255, 0.9)",
                        fontWeight: "900",
                    }}
                    className="font-bold"
                >
                  {number}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        )
    }

    function WildCard({ className, onClick, disabled }) {
        // Card styles
        const cardStyles = {
            button: {
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s",
                cursor: disabled ? "not-allowed" : "pointer",
                width: className?.includes("w-20") ? "5rem" : className?.includes("w-16") ? "4rem" : "5rem",
                height: className?.includes("h-28") ? "7rem" : className?.includes("h-24") ? "6rem" : "7rem",
            },
            outerBorder: {
                position: "absolute",
                inset: "0",
                backgroundColor: "black",
                borderRadius: "0.5rem",
            },
            innerCard: {
                position: "absolute",
                inset: "4px",
                backgroundColor: "#fffffb",
                borderRadius: "0.375rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            },
            topLeftStar: {
                position: "absolute",
                top: "0.25rem",
                left: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            bottomRightStar: {
                position: "absolute",
                bottom: "0.25rem",
                right: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            centerOval: {
                border: "3px solid black",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "92%",
                height: "86.25%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            },
            centerStarContainer: {
                width: "75%",
                height: "75%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        }

        // Rainbow gradient for wild card star
        const wildStarStyle = {
            background: "linear-gradient(45deg, #F42C04, #FFB30F, #3E8914, #1789FC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "1.5rem",
        }

        // Smaller stars for corners
        const cornerStarStyle = {
            ...wildStarStyle,
            fontSize: "1rem",
        }

        return (
            <button
                className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={onClick}
                disabled={disabled}
                type="button"
                style={cardStyles.button}
            >
                {/* Card background */}
                <div className="absolute inset-0 bg-black rounded-lg" style={cardStyles.outerBorder}>
                    <div
                        className="absolute inset-[4px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center"
                        style={cardStyles.innerCard}
                    >
                        {/* Star in top left */}
                        <div style={cardStyles.topLeftStar}>
                            <StarIcon style={cornerStarStyle} />
                        </div>

                        {/* Star in bottom right */}
                        <div style={cardStyles.bottomRightStar}>
                            <StarIcon style={cornerStarStyle} />
                        </div>

                        {/* Center oval with wild star */}
                        <div
                            className="border-[3px] sm:border-[4px] border-black rounded-[50%] flex items-center justify-center"
                            style={cardStyles.centerOval}
                        >
                            <div style={cardStyles.centerStarContainer}>
                                <StarIcon style={wildStarStyle} fontSize="large" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        )
    }

    function CardBack({ className, isDark = false, onClick }) {
        const bgColor = isDark ? "bg-black" : "bg-[#fffffb]"
        const starColor = isDark ? "#FFFFFF" : "#000000"

        // Add white border class only for dark mode cards
        const borderClass = isDark ? "border-[2px] border-white" : ""

        // Card styles
        const cardStyles = {
            button: {
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s",
                cursor: "pointer",
                width: className?.includes("w-20") ? "5rem" : className?.includes("w-8") ? "2rem" : "5rem",
                height: className?.includes("h-28") ? "7rem" : className?.includes("h-12") ? "3rem" : "7rem",
            },
            outerBorder: {
                position: "absolute",
                inset: "0",
                backgroundColor: "black",
                borderRadius: "0.5rem",
            },
            innerCard: {
                position: "absolute",
                inset: "4px",
                backgroundColor: isDark ? "black" : "#fffffb",
                borderRadius: "0.375rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isDark ? "2px solid white" : "none",
            },
            starContainer: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        }

        return (
            <button
                className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""}`}
                onClick={onClick}
                type="button"
                style={cardStyles.button}
            >
                {/* Card background */}
                <div className="absolute inset-0 bg-black rounded-lg" style={cardStyles.outerBorder}>
                    <div
                        className={`absolute inset-[4px] ${bgColor} ${borderClass} rounded-md flex items-center justify-center`}
                        style={cardStyles.innerCard}
                    >
                        {/* Center star */}
                        <div style={cardStyles.starContainer}>
                            <StarIcon style={{ color: starColor, fontSize: "2rem" }} />
                        </div>
                    </div>
                </div>
            </button>
        )
    }

    function ColorPicker({ onSelectColor, onClose }) {
        const colors = ["red", "blue", "green", "yellow"]
        const colorHexMap = {
            red: "#F42C04",
            blue: "#1789FC",
            yellow: "#FFB30F",
            green: "#3E8914",
        }

        // Handle color selection and close
        const handleColorSelect = (color) => {
            onSelectColor(color)
            if (onClose) onClose()
        }

        return (
            <div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                style={styles.colorPickerOverlay}
            >
                <div
                    className="bg-black bg-opacity-90 rounded-xl p-6 shadow-2xl border-2 border-white max-w-xs w-full"
                    style={styles.colorPickerContainer}
                >
                    <div className="flex justify-between items-center mb-4" style={styles.colorPickerHeader}>
                        <h3 className="text-white text-xl font-bold" style={styles.colorPickerTitle}>
                            Choose a color
                        </h3>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-300"
                                aria-label="Close color picker"
                                style={styles.closeButton}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    style={{ width: "1.5rem", height: "1.5rem" }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4" style={styles.colorGrid}>
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className="w-full h-20 rounded-xl shadow-lg transform transition-transform hover:scale-105 border-4 border-white flex items-center justify-center"
                                style={{
                                    ...styles.colorButton,
                                    backgroundColor: colorHexMap[color],
                                }}
                                aria-label={`Select ${color}`}
                            >
                <span
                    className={`font-bold text-lg ${color === "yellow" ? "text-black" : "text-white"}`}
                    style={{
                        ...styles.colorButtonText,
                        color: color === "yellow" ? "black" : "white",
                    }}
                >
                  {color.toUpperCase()}
                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Render the top card from the played pile
    const renderTopCard = () => {
        if (playedPile.length === 0) return null

        const topCard = playedPile[0]
        const cardDetails = getCardDetails(topCard)

        if (cardDetails.type === "wild") {
            return <WildCard className="w-20 h-28 sm:w-24 sm:h-36" disabled={true} />
        } else {
            return (
                <UnoCard
                    color={cardDetails.color}
                    number={cardDetails.number}
                    className="w-20 h-28 sm:w-24 sm:h-36"
                    disabled={true}
                />
            )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4" style={styles.container}>
            <h1 className="text-3xl font-bold text-center mb-6" style={styles.title}>
                UNO Game
            </h1>

            {gameOver ? (
                <div className="flex flex-col items-center justify-center space-y-6" style={styles.winnerContainer}>
                    <h2 className="text-4xl font-bold text-yellow-400" style={styles.winnerText}>
                        {winner} won!
                    </h2>
                    <button
                        onClick={restartGame}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg transition-colors"
                        style={styles.playAgainButton}
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center" style={styles.gameContainer}>
                    <div className="w-full max-w-4xl" style={styles.gameContent}>
                        {/* Game status */}
                        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-center" style={styles.statusBar}>
                            <h2 className="text-xl font-semibold" style={styles.statusText}>
                                {gameMessage}
                                {currentPlayer > 0 && (
                                    <span className="ml-2 text-yellow-400" style={styles.botTurnText}>
                    (Bot {currentPlayer}'s turn)
                  </span>
                                )}
                            </h2>
                            <p className="text-sm text-gray-400" style={styles.colorText}>
                                Current color:{" "}
                                <span
                                    className="font-bold"
                                    style={{
                                        color:
                                            currentColor === "red"
                                                ? "#F42C04"
                                                : currentColor === "blue"
                                                    ? "#1789FC"
                                                    : currentColor === "yellow"
                                                        ? "#FFB30F"
                                                        : "#3E8914",
                                        fontWeight: "bold",
                                    }}
                                >
                  {currentColor}
                </span>
                            </p>
                        </div>

                        {/* Bot cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6" style={styles.botGrid}>
                            {botDecks.map((deck, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-lg p-3 flex flex-col items-center"
                                    style={styles.botCard}
                                >
                                    <h3 className="text-lg font-semibold mb-2" style={styles.botTitle}>
                                        Bot {index + 1}
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-1" style={styles.botCardContainer}>
                                        {Array(Math.min(deck.length, 5))
                                            .fill(0)
                                            .map((_, i) => (
                                                <CardBack key={i} isDark={true} className="w-8 h-12 sm:w-10 sm:h-14" />
                                            ))}
                                    </div>
                                    <p className="mt-2 text-sm" style={styles.cardCount}>
                                        {deck.length} cards
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Play area */}
                        <div className="flex justify-center items-center gap-8 mb-8" style={styles.playArea}>
                            {/* Draw pile */}
                            <div className="flex flex-col items-center" style={styles.drawPileContainer}>
                                <CardBack isDark={true} className="w-20 h-28 sm:w-24 sm:h-36 mb-2" onClick={drawCard} />
                                <p className="text-sm" style={styles.cardCount}>
                                    {drawCardPile.length} cards
                                </p>
                                <button
                                    onClick={drawCard}
                                    disabled={currentPlayer !== 0 || gameOver || lastPlayedWild}
                                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        ...styles.drawButton,
                                        ...(currentPlayer !== 0 || gameOver || lastPlayedWild ? styles.disabledButton : {}),
                                    }}
                                >
                                    Draw
                                </button>
                            </div>

                            {/* Played pile */}
                            <div className="flex flex-col items-center" style={styles.playedPileContainer}>
                                <div className="relative">{renderTopCard()}</div>
                                <p className="text-sm mt-2" style={styles.cardCount}>
                                    Played pile
                                </p>
                            </div>
                        </div>

                        {/* Player's hand */}
                        <div className="bg-gray-800 rounded-lg p-4" style={styles.playerHandContainer}>
                            <h3 className="text-lg font-semibold mb-3" style={styles.playerHandTitle}>
                                Your Cards ({playerDeck.length})
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2" style={styles.playerCards}>
                                {playerDeck.map((card, index) => {
                                    const cardDetails = getCardDetails(card)

                                    return cardDetails.type === "wild" ? (
                                        <WildCard
                                            key={index}
                                            className="w-16 h-24 sm:w-20 sm:h-28"
                                            onClick={() => playCard(index)}
                                            disabled={currentPlayer !== 0 || gameOver || lastPlayedWild}
                                        />
                                    ) : (
                                        <UnoCard
                                            key={index}
                                            color={cardDetails.color}
                                            number={cardDetails.number}
                                            className="w-16 h-24 sm:w-20 sm:h-28"
                                            onClick={() => playCard(index)}
                                            disabled={currentPlayer !== 0 || gameOver || lastPlayedWild}
                                        />
                                    )
                                })}
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

