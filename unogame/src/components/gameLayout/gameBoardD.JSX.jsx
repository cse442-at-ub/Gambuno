// "use client"
//
// import { useState, useEffect, useRef } from "react"
// import { UnoCard, WildCard, CardBack} from "./cards/cards"
// import { createDeck, dealCards, canPlayCard, applyCardEffect } from "../../lib/game-logic"
// import { motion, AnimatePresence } from "framer-motion"
// import { ColorPicker } from "./cards/cards"
//
// export function GameBoard({ numPlayers = 5 }) {
//     const [gameState, setGameState] = useState(null)
//     const [showColorPicker, setShowColorPicker] = useState(false)
//     const [pendingWildCard, setPendingWildCard] = useState(null)
//     const [winner, setWinner] = useState(null)
//     const [gameStarted, setGameStarted] = useState(false)
//     const [playerNames, setPlayerNames] = useState("use client"
//
//     import { useState, useEffect, useRef } from "react"
//     import { UnoCard, WildCard, CardBack} from "./cards/cards"
//     import { createDeck, dealCards, canPlayCard, applyCardEffect } from "../../lib/game-logic"
//     import { motion, AnimatePresence } from "framer-motion"
//     import { ColorPicker } from "./cards/cards"
//
//     export function GameBoard({ numPlayers = 5 }) {
//         const [gameState, setGameState] = useState(null)
//         const [showColorPicker, setShowColorPicker] = useState(false)
//         const [pendingWildCard, setPendingWildCard] = useState(null)
//         const [winner, setWinner] = useState(null)
//         const [gameStarted, setGameStarted] = useState(false)
//         const [playerNames, setPlayerNames] = useState(
//             Array(numPlayers)
//                 .fill("")
//                 .map((_, i) => `Player ${i + 1}`),
//         )
//         const [animatingCard, setAnimatingCard] = useState(null)
//         const [drawingPlayer, setDrawingPlayer] = useState(null)
//         const [animations, setAnimations] = useState([])
//         const [isDrawing, setIsDrawing] = useState(false) // New state to track drawing status
//         const tableRef = useRef(null)
//         const animationIdRef = useRef(0)
//         const windowSize = useRef({
//             width: typeof window !== "undefined" ? window.innerWidth : 1200,
//             height: typeof window !== "undefined" ? window.innerHeight : 800,
//         })
//
//         // Initialize game
//         const initGame = () => {
//             const deck = createDeck()
//             const { hands, deck: newDeck, discardPile } = dealCards(deck, numPlayers)
//
//             setGameState({
//                 players: hands,
//                 drawPile: newDeck,
//                 discardPile,
//                 currentPlayer: 0,
//                 direction: 1,
//                 currentColor: discardPile[0].color,
//                 lastCard: discardPile[0],
//                 sayUno: false,
//                 visibleDiscardPile: [discardPile[0]], // Track visible cards in the discard pile
//             })
//
//             setWinner(null)
//             setGameStarted(true)
//             setAnimations([])
//             setIsDrawing(false)
//         }
//
//         // Update window size on resize
//         useEffect(() => {
//             const handleResize = () => {
//                 windowSize.current = {
//                     width: window.innerWidth,
//                     height: window.innerHeight,
//                 }
//             }
//
//             window.addEventListener("resize", handleResize)
//             handleResize() // Initial call
//
//             return () => window.removeEventListener("resize", handleResize)
//         }, [])
//
//         // Add a new animation
//         const addAnimation = (type, card, from, to, onComplete) => {
//             const id = animationIdRef.current++
//
//             // Add animation with improved timing and sequencing
//             setAnimations((prev) => [
//                 ...prev,
//                 {
//                     id,
//                     type,
//                     card,
//                     from,
//                     to,
//                     onComplete,
//                     startTime: Date.now(),
//                 },
//             ])
//
//             // Auto-remove animation after it completes
//             // Use a longer duration to ensure smooth transitions
//             setTimeout(() => {
//                 setAnimations((prev) => prev.filter((anim) => anim.id !== id))
//                 if (onComplete) onComplete()
//             }, 800) // Slightly longer animation for smoother feel
//         }
//
//         // Handle drawing a card with animation
//         const handleDrawCard = () => {
//             // Prevent drawing if not player's turn, there's a winner, or already drawing
//             if (gameState.currentPlayer !== 0 || winner || isDrawing) return
//
//             // Set drawing state to prevent multiple draws
//             setIsDrawing(true)
//
//             // Check if the player already has a valid card to play
//             const hasPlayableCard = gameState.players[0].some(
//                 (card) =>
//                     card.type === "special" ||
//                     card.color === gameState.currentColor ||
//                     (gameState.lastCard && card.value === gameState.lastCard.value),
//             )
//
//             // Generate a new random card instead of taking from the deck
//             const newCard = generateRandomCard()
//
//             // Add the card to the player's hand
//             setGameState((prev) => {
//                 const newState = { ...prev }
//                 newState.players[0] = [...newState.players[0], newCard]
//                 return newState
//             })
//
//             // Add draw animation
//             addAnimation("draw", newCard, "drawPile", "player", () => {
//                 // If player already had playable cards, only draw one card
//                 if (hasPlayableCard) {
//                     setIsDrawing(false) // Reset drawing state after drawing one card
//                 } else {
//                     // Check if the newly drawn card is playable
//                     const isNewCardPlayable =
//                         newCard.type === "special" ||
//                         newCard.color === gameState.currentColor ||
//                         (gameState.lastCard && newCard.value === gameState.lastCard.value)
//
//                     // If not playable, draw another card automatically after a short delay
//                     if (!isNewCardPlayable) {
//                         setTimeout(() => {
//                             setIsDrawing(false) // Reset drawing state before drawing again
//                             handleDrawCard()
//                         }, 300) // Short delay for better visual flow
//                     } else {
//                         // Card is playable, reset drawing state
//                         setIsDrawing(false)
//                     }
//                 }
//             })
//         }
//
//         // Generate a random card for infinite deck
//         const generateRandomCard = () => {
//             const colors = ["red", "blue", "green", "yellow"]
//             const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
//             const specialTypes = ["Wild", "Wild4"]
//
//             // 20% chance of getting a special card
//             const isSpecial = Math.random() < 0.2
//
//             if (isSpecial) {
//                 const specialValue = specialTypes[Math.floor(Math.random() * specialTypes.length)]
//                 return {
//                     id: `special-${specialValue}-${Date.now()}`,
//                     color: "wild",
//                     value: specialValue,
//                     type: "special",
//                 }
//             } else {
//                 const color = colors[Math.floor(Math.random() * colors.length)]
//                 const value = values[Math.floor(Math.random() * values.length)]
//                 return {
//                     id: `${color}-${value}-${Date.now()}`,
//                     color,
//                     value,
//                     type: "number",
//                 }
//             }
//         }
//
//         // Handle playing a card with animation
//         const handlePlayCard = (card, index) => {
//             if (gameState.currentPlayer !== 0 || winner || isDrawing) return
//
//             // Check if the card can be played
//             if (!canPlayCard(card, gameState.lastCard, gameState.currentColor)) {
//                 return
//             }
//
//             // Handle wild cards
//             if (card.type === "special") {
//                 setPendingWildCard({ card, index })
//                 setShowColorPicker(true)
//                 return
//             }
//
//             // First visually remove the card from the hand
//             setGameState((prev) => {
//                 const newState = { ...prev }
//                 // Create a temporary copy without the card to be played
//                 // This makes it visually disappear from the hand
//                 const tempHand = [...newState.players[0]]
//                 tempHand.splice(index, 1)
//                 newState.players[0] = tempHand
//                 return newState
//             })
//
//             // Then add play animation
//             setTimeout(() => {
//                 addAnimation("play", card, "player", "discardPile", () => {
//                     playCard(card, index, card.color)
//                 })
//             }, 50) // Small delay to ensure the card is visually removed first
//         }
//
//         // Play a card with the selected color (for wild cards)
//         const playCard = (card, index, selectedColor) => {
//             setGameState((prev) => {
//                 const newState = { ...prev }
//
//                 // Remove the card from the player's hand
//                 const playerHand = [...newState.players[newState.currentPlayer]]
//                 playerHand.splice(index, 1)
//                 newState.players[newState.currentPlayer] = playerHand
//
//                 // Add the card to the discard pile
//                 newState.discardPile = [...newState.discardPile, card]
//                 newState.lastCard = card
//
//                 // Update the visible discard pile (keep last 5 cards)
//                 newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), card].slice(-5)
//
//                 // Update the current color
//                 newState.currentColor = selectedColor || card.color
//
//                 // Apply card effects
//                 const { nextPlayer, direction, drawCount } = applyCardEffect(newState, card)
//                 newState.currentPlayer = nextPlayer
//                 newState.direction = direction
//
//                 // Handle draw cards
//                 if (drawCount > 0) {
//                     for (let i = 0; i < drawCount; i++) {
//                         if (newState.drawPile.length === 0) {
//                             // Reshuffle if needed
//                             const topCard = newState.discardPile.pop()
//                             newState.drawPile = [...newState.discardPile].sort(() => Math.random() - 0.5)
//                             newState.discardPile = [topCard]
//                         }
//
//                         const drawnCard = newState.drawPile.pop()
//                         newState.players[nextPlayer] = [...newState.players[nextPlayer], drawnCard]
//                     }
//                 }
//
//                 // Check for winner
//                 if (playerHand.length === 0) {
//                     setWinner(newState.currentPlayer)
//                     return newState
//                 }
//
//                 // AI players will play automatically
//                 setTimeout(() => {
//                     playAITurn()
//                 }, 2)
//
//                 return newState
//             })
//         }
//
//         // Handle color selection for wild cards
//         const handleColorSelect = (color) => {
//             setShowColorPicker(false)
//             if (pendingWildCard) {
//                 // First visually remove the card from the hand
//                 setGameState((prev) => {
//                     const newState = { ...prev }
//                     // Create a temporary copy without the card to be played
//                     const tempHand = [...newState.players[0]]
//                     tempHand.splice(pendingWildCard.index, 1)
//                     newState.players[0] = tempHand
//                     return newState
//                 })
//
//                 // Then add play animation
//                 setTimeout(() => {
//                     addAnimation("play", pendingWildCard.card, "player", "discardPile", () => {
//                         playCard(pendingWildCard.card, pendingWildCard.index, color)
//                         setPendingWildCard(null)
//                     })
//                 }, 50)
//             }
//         }
//
//         // AI player turn logic with animations
//         const playAITurn = () => {
//             if (!gameState || gameState.currentPlayer === 0 || winner) return
//
//             const currentPlayerIndex = gameState.currentPlayer
//             const playerHand = gameState.players[currentPlayerIndex]
//
//             // Find playable cards
//             const playableCards = playerHand.filter(
//                 (card) =>
//                     card.type === "special" || card.color === gameState.currentColor || card.value === gameState.lastCard.value,
//             )
//
//             if (playableCards.length > 0) {
//                 // Choose a card to play (simple AI strategy)
//                 const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)]
//                 const cardIndex = playerHand.findIndex((c) => c.id === cardToPlay.id)
//
//                 // First visually remove the card from the AI hand
//                 setGameState((prev) => {
//                     const newState = { ...prev }
//                     const tempHand = [...newState.players[currentPlayerIndex]]
//                     tempHand.splice(cardIndex, 1)
//                     newState.players[currentPlayerIndex] = tempHand
//                     return newState
//                 })
//
//                 // Then add play animation for AI
//                 setTimeout(() => {
//                     const playerPosition = getPlayerPosition(currentPlayerIndex).position
//                     addAnimation("play", cardToPlay, playerPosition, "discardPile", () => {
//                         setGameState((prev) => {
//                             const newState = { ...prev }
//
//                             // Remove the card from the player's hand
//                             const newPlayerHand = [...playerHand]
//                             newPlayerHand.splice(cardIndex, 1)
//                             newState.players[currentPlayerIndex] = newPlayerHand
//
//                             // Add the card to the discard pile
//                             newState.discardPile = [...newState.discardPile, cardToPlay]
//                             newState.lastCard = cardToPlay
//
//                             // Update the visible discard pile (keep last 5 cards)
//                             newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), cardToPlay].slice(-5)
//
//                             // Handle wild cards
//                             if (cardToPlay.type === "special") {
//                                 // AI chooses a color (simple strategy: choose the most common color in hand)
//                                 const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 }
//                                 newPlayerHand.forEach((c) => {
//                                     if (c.color !== "wild") {
//                                         colorCounts[c.color]++
//                                     }
//                                 })
//
//                                 let maxColor = "red"
//                                 let maxCount = 0
//                                 Object.entries(colorCounts).forEach(([color, count]) => {
//                                     if (count > maxCount) {
//                                         maxColor = color
//                                         maxCount = count
//                                     }
//                                 })
//
//                                 newState.currentColor = maxColor
//                             } else {
//                                 newState.currentColor = cardToPlay.color
//                             }
//
//                             // Apply card effects
//                             const { nextPlayer, direction, drawCount } = applyCardEffect(newState, cardToPlay)
//                             newState.currentPlayer = nextPlayer
//                             newState.direction = direction
//
//                             // Handle draw cards with sequential animations
//                             if (drawCount > 0) {
//                                 // Create a sequence of animations with proper timing
//                                 const animateDrawSequence = (index) => {
//                                     if (index >= drawCount) {
//                                         // All animations complete, continue game
//                                         if (newState.currentPlayer !== 0) {
//                                             setTimeout(() => playAITurn(), 500)
//                                         }
//                                         return
//                                     }
//
//                                     // Generate a random card
//                                     const drawnCard = generateRandomCard()
//
//                                     // Add the card to the player's hand
//                                     newState.players[nextPlayer].push(drawnCard)
//
//                                     // Add draw animation with chained callback
//                                     addAnimation("draw", drawnCard, "drawPile", getPlayerPosition(nextPlayer).position, () => {
//                                         // Chain to the next animation
//                                         setTimeout(() => {
//                                             animateDrawSequence(index + 1)
//                                         }, 200) // Short delay between sequential draws
//                                     })
//                                 }
//
//                                 // Start the animation sequence
//                                 animateDrawSequence(0)
//
//                                 return newState
//                             }
//
//                             // Check for winner
//                             if (newPlayerHand.length === 0) {
//                                 setWinner(currentPlayerIndex)
//                                 return newState
//                             }
//
//                             // Continue AI turns if the next player is also AI
//                             if (newState.currentPlayer !== 0) {
//                                 setTimeout(() => {
//                                     playAITurn()
//                                 }, 800)
//                             }
//
//                             return newState
//                         })
//                     })
//                 }, 50)
//             } else {
//                 // AI needs to draw a card
//                 // Generate a random card instead of taking from the deck
//                 const drawnCard = generateRandomCard()
//
//                 // Update state with the new card
//                 setGameState((prev) => {
//                     const newState = { ...prev }
//                     // Add the card to the player's hand immediately
//                     newState.players[currentPlayerIndex].push(drawnCard)
//                     return newState
//                 })
//
//                 // Add draw animation for AI with improved timing
//                 const playerPosition = getPlayerPosition(currentPlayerIndex).position
//                 addAnimation("draw", drawnCard, "drawPile", playerPosition, () => {
//                     // Check if the drawn card can be played
//                     if (canPlayCard(drawnCard, gameState.lastCard, gameState.currentColor)) {
//                         // Recursively call AI turn to play the card
//                         setTimeout(() => {
//                             playAITurn()
//                         }, 600)
//                     } else {
//                         // Draw another card since this one can't be played
//                         setTimeout(() => {
//                             playAITurn()
//                         }, 600)
//                     }
//                 })
//             }
//         }
//
//         // Say UNO button handler
//         const handleSayUno = () => {
//             if (gameState.players[0].length === 1) {
//                 setGameState((prev) => ({
//                     ...prev,
//                     sayUno: true,
//                 }))
//             }
//         }
//
//         // Get player position based on player index and total number of players
//         const getPlayerPosition = (playerIndex) => {
//             // Player 0 is always at the bottom
//             if (playerIndex === 0) return { position: "bottom", rotation: 0 }
//
//             if (numPlayers === 3) {
//                 // 3 player layout: bottom, top-left, top-right
//                 if (playerIndex === 1) return { position: "top-left", rotation: -20 }
//                 if (playerIndex === 2) return { position: "top-right", rotation: 20 }
//             } else if (numPlayers === 4) {
//                 // 4 player layout: bottom, left, top, right
//                 if (playerIndex === 1) return { position: "left", rotation: 90 }
//                 if (playerIndex === 2) return { position: "top", rotation: 0 }
//                 if (playerIndex === 3) return { position: "right", rotation: -90 }
//             } else if (numPlayers === 5) {
//                 // 5 player layout: bottom, left, top-left, top-right, right
//                 if (playerIndex === 1) return { position: "left", rotation: 90 }
//                 if (playerIndex === 2) return { position: "top-left", rotation: -20 }
//                 if (playerIndex === 3) return { position: "top-right", rotation: 20 }
//                 if (playerIndex === 4) return { position: "right", rotation: -90 }
//             } else if (numPlayers === 6) {
//                 // 6 player layout: bottom, left, top-left, top, top-right, right
//                 if (playerIndex === 1) return { position: "left", rotation: 90 }
//                 if (playerIndex === 2) return { position: "top-left", rotation: -20 }
//                 if (playerIndex === 3) return { position: "top", rotation: 0 }
//                 if (playerIndex === 4) return { position: "top-right", rotation: 20 }
//                 if (playerIndex === 5) return { position: "right", rotation: -90 }
//             }
//
//             // Default fallback
//             return { position: "top", rotation: 0 }
//         }
//
//         // Get position coordinates for animations
//         const getPositionCoordinates = (position) => {
//             // Use window dimensions or fixed values based on the game board
//             const centerX = windowSize.current.width / 2
//             const centerY = windowSize.current.height / 2
//
//             switch (position) {
//                 case "drawPile":
//                     return { x: centerX - 60, y: centerY }
//                 case "discardPile":
//                     // Add slight randomness to the landing position for a more natural stack
//                     const randomX = Math.random() * 10 - 5
//                     const randomY = Math.random() * 10 - 5
//                     return { x: centerX + 60 + randomX, y: centerY + randomY }
//                 case "player":
//                 case "bottom":
//                     return { x: centerX, y: centerY + 200 }
//                 case "top":
//                     return { x: centerX, y: centerY - 200 }
//                 case "top-left":
//                     return { x: centerX - 180, y: centerY - 180 }
//                 case "top-right":
//                     return { x: centerX + 180, y: centerY - 180 }
//                 case "left":
//                     return { x: centerX - 270, y: centerY - 20 } // Adjusted to be higher
//                 case "right":
//                     return { x: centerX + 270, y: centerY - 20 } // Adjusted to be higher
//                 default:
//                     return { x: centerX, y: centerY }
//             }
//         }
//
//         // Start a new game
//         useEffect(() => {
//             if (!gameStarted) {
//                 initGame()
//             }
//         }, [gameStarted])
//
//         if (!gameState) {
//             return (
//                 <div className="flex items-center justify-center h-screen bg-[#3E8914]">
//                     <button
//                         className="px-6 py-3 bg-black text-white rounded-lg text-xl font-bold shadow-lg hover:bg-gray-800 transition-colors"
//                         onClick={initGame}
//                     >
//                         Start Game
//                     </button>
//                 </div>
//             )
//         }
//
//         // Render player's hand with fan effect
//         const renderPlayerHand = (playerIndex) => {
//             if (!gameState.players[playerIndex]) return null
//
//             const { position, rotation } = getPlayerPosition(playerIndex)
//             const isCurrentPlayer = gameState.currentPlayer === playerIndex
//             const cards = gameState.players[playerIndex]
//             const totalCards = cards.length
//
//             // Calculate fan properties based on position
//             let fanWidth, fanHeight, transformOrigin, baseTransform
//
//             let containerStyle = {} // Define containerStyle here
//
//             switch (position) {
//                 case "bottom":
//                     // Calculate fan width based on number of cards, but ensure it's centered
//                     fanWidth = Math.min(totalCards * 20, 400) // Limit max width
//                     transformOrigin = "bottom center"
//                     // This transform ensures cards grow from the center
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20 // 20px spacing between cards
//                         const angle = (index - centerIndex) * 3 // 3 degrees rotation per card
//                         return `translateX(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         bottom: "4rem",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "100%",
//                         maxWidth: "800px",
//                         display: "flex",
//                         justifyContent: "center",
//                     }
//                     break
//                 case "top":
//                     fanWidth = Math.min(totalCards * 20, 300)
//                     transformOrigin = "top center"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3
//                         return `translateX(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         top: "4rem",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "100%",
//                         maxWidth: "400px",
//                         display: "flex",
//                         justifyContent: "center",
//                     }
//                     break
//                 case "top-left":
//                     fanWidth = Math.min(totalCards * 20, 250)
//                     transformOrigin = "top center"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3 - 20 // -20 degree base rotation
//                         return `translateX(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         top: "4rem",
//                         left: "25%",
//                         transform: "translateX(-50%)",
//                         width: "100%",
//                         maxWidth: "300px",
//                         display: "flex",
//                         justifyContent: "center",
//                     }
//                     break
//                 case "top-right":
//                     fanWidth = Math.min(totalCards * 20, 250)
//                     transformOrigin = "top center"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3 + 20 // +20 degree base rotation
//                         return `translateX(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         top: "4rem",
//                         right: "25%",
//                         transform: "translateX(50%)",
//                         width: "100%",
//                         maxWidth: "300px",
//                         display: "flex",
//                         justifyContent: "center",
//                     }
//                     break
//                 case "left":
//                     fanHeight = Math.min(totalCards * 20, 250)
//                     transformOrigin = "center right"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3 + 90 // +90 degree base rotation
//                         return `translateY(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         top: "40%", // Move up from 50% to 40% to match the screenshot
//                         left: "4rem",
//                         transform: "translateY(-50%)",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         height: "300px",
//                     }
//                     break
//                 case "right":
//                     fanHeight = Math.min(totalCards * 20, 250)
//                     transformOrigin = "center left"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3 - 90 // -90 degree base rotation
//                         return `translateY(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         top: "40%", // Move up from 50% to 40% to match the screenshot
//                         right: "4rem",
//                         transform: "translateY(-50%)",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         height: "300px",
//                     }
//                     break
//                 default:
//                     fanWidth = Math.min(totalCards * 20, 300)
//                     transformOrigin = "bottom center"
//                     baseTransform = (index, totalCards) => {
//                         const centerIndex = (totalCards - 1) / 2
//                         const offset = (index - centerIndex) * 20
//                         const angle = (index - centerIndex) * 3
//                         return `translateX(${offset}px) rotate(${angle}deg)`
//                     }
//                     containerStyle = {
//                         bottom: "4rem",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: "100%",
//                         maxWidth: "800px",
//                         display: "flex",
//                         justifyContent: "center",
//                     }
//             }
//
//             return (
//                 <div className={`absolute ${isCurrentPlayer ? "z-10" : ""} player-${position}`} style={containerStyle}>
//                     {/* Player name with improved positioning */}
//                     <div
//                         className="player-name-tag"
//                         style={{
//                             position: "absolute",
//                             left: "50%",
//                             top: position === "top" || position.includes("top") ? "-3.5rem" : "auto",
//                             bottom: position === "bottom" ? "-3.5rem" : "auto",
//                             right: "auto",
//                             transform: "translateX(-50%)",
//                             zIndex: 30,
//                         }}
//                     >
//           <span className="bg-black/70 text-white font-bold px-3 py-1 rounded-md whitespace-nowrap">
//             {playerNames[playerIndex]} {isCurrentPlayer ? "(Playing)" : ""}
//           </span>
//                     </div>
//
//                     <div
//                         className="relative"
//                         style={{
//                             height: position.includes("left") || position.includes("right") ? "250px" : "120px",
//                             width: "100%",
//                             display: "flex",
//                             justifyContent: "center",
//                         }}
//                     >
//                         {cards.map((card, index) => {
//                             const canPlay =
//                                 isCurrentPlayer &&
//                                 (card.type === "special" ||
//                                     card.color === gameState.currentColor ||
//                                     (gameState.lastCard && card.value === gameState.lastCard.value))
//
//                             // For player 0 (user), we need special handling for playable cards
//                             const transform = baseTransform(index, totalCards)
//                             const hoverTransform =
//                                 playerIndex === 0 && canPlay ? `${baseTransform(index, totalCards)} translateY(-30px)` : transform
//
//                             return (
//                                 <div
//                                     key={playerIndex === 0 ? card.id : `${playerIndex}-${index}`}
//                                     className="absolute transition-all duration-200"
//                                     style={{
//                                         transform: playerIndex === 0 && canPlay ? `${transform} translateY(-10px)` : transform,
//                                         transformOrigin: transformOrigin,
//                                         zIndex: index,
//                                     }}
//                                     onMouseEnter={
//                                         playerIndex === 0 && canPlay
//                                             ? (e) => {
//                                                 e.currentTarget.style.transform = hoverTransform
//                                             }
//                                             : undefined
//                                     }
//                                     onMouseLeave={
//                                         playerIndex === 0 && canPlay
//                                             ? (e) => {
//                                                 e.currentTarget.style.transform = `${transform} translateY(-10px)`
//                                             }
//                                             : undefined
//                                     }
//                                 >
//                                     {playerIndex === 0 ? (
//                                         card.type === "special" ? (
//                                             <WildCard
//                                                 onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
//                                                 disabled={!canPlay}
//                                                 className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                             />
//                                         ) : (
//                                             <UnoCard
//                                                 color={card.color}
//                                                 number={card.value}
//                                                 onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
//                                                 disabled={!canPlay}
//                                                 className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                             />
//                                         )
//                                     ) : (
//                                         <CardBack isDark={true} className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40" onClick={() => {}} />                    )}
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>
//             )
//         }
//
//         // Render animations
//         const renderAnimations = () => {
//             return (
//                 <AnimatePresence mode="sync">
//                     {animations.map((anim) => {
//                         const fromPos = getPositionCoordinates(anim.from)
//                         const toPos = getPositionCoordinates(anim.to)
//
//                         // Determine rotation based on positions
//                         let fromRotation = 0
//                         if (anim.from === "left") fromRotation = 90
//                         if (anim.from === "right") fromRotation = -90
//
//                         let toRotation = 0
//                         if (anim.to === "left") toRotation = 90
//                         if (anim.to === "right") toRotation = -90
//
//                         // Animation variants with improved transitions - properly typed for Framer Motion
//                         const variants = {
//                             initial: {
//                                 x: fromPos.x - 40, // Adjust for card width
//                                 y: fromPos.y - 60, // Adjust for card height
//                                 scale: 1,
//                                 rotate: fromRotation,
//                                 zIndex: 100,
//                                 opacity: 1,
//                                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                             },
//                             animate: {
//                                 x: toPos.x - 40, // Adjust for card width
//                                 y: toPos.y - 60, // Adjust for card height
//                                 scale: [1, 1.1, 1], // Smoother scale effect
//                                 rotate: toRotation,
//                                 zIndex: 100,
//                                 opacity: 1,
//                                 boxShadow: [
//                                     "0 4px 8px rgba(0, 0, 0, 0.2)",
//                                     "0 8px 16px rgba(0, 0, 0, 0.3)",
//                                     "0 4px 8px rgba(0, 0, 0, 0.2)",
//                                 ],
//                                 transition: {
//                                     duration: 0.8, // Longer duration for smoother motion
//                                     ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
//                                     scale: {
//                                         times: [0, 0.5, 1],
//                                         duration: 0.8,
//                                     },
//                                     boxShadow: {
//                                         times: [0, 0.5, 1],
//                                         duration: 0.8,
//                                     },
//                                 },
//                             },
//                             exit: {
//                                 opacity: 0,
//                                 transition: { duration: 0.3 },
//                             },
//                         }
//
//                         return (
//                             <motion.div
//                                 key={anim.id}
//                                 style={{ width: "80px", height: "120px", position: "fixed" }}
//                                 initial="initial"
//                                 animate="animate"
//                                 exit="exit"
//                                 variants={variants}
//                                 onAnimationComplete={anim.onComplete}
//                             >
//                                 {anim.card.type === "special" ? (
//                                     <WildCard
//                                         className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                         onClick={() => {}}
//                                         disabled={false}
//                                     />
//                                 ) : (
//                                     <UnoCard
//                                         color={anim.card.color}
//                                         number={anim.card.value}
//                                         className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                         onClick={() => {}}
//                                         disabled={false}
//                                     />
//                                 )}
//                             </motion.div>
//                         )
//                     })}
//                 </AnimatePresence>
//             )
//         }
//
//         // Function to shuffle the deck
//         const shuffleDeck = (deck) => {
//             const newDeck = [...deck]
//             for (let i = newDeck.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1))
//                 ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
//             }
//             return newDeck
//         }
//
//         return (
//             <div className="min-h-screen bg-[#3E8914] relative overflow-hidden" ref={tableRef}>
//                 {/* Winner announcement */}
//                 {winner !== null && (
//                     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//                         <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
//                             <h2 className="text-3xl font-bold mb-4">{winner === 0 ? "You Win!" : `${playerNames[winner]} Wins!`}</h2>
//                             <button
//                                 className="px-6 py-3 bg-[#3E8914] text-white rounded-lg text-xl font-bold shadow-lg hover:bg-[#2d6610] transition-colors"
//                                 onClick={initGame}
//                             >
//                                 Play Again
//                             </button>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Color picker for wild cards */}
//                 {showColorPicker && <ColorPicker onSelectColor={handleColorSelect} onClose={() => setShowColorPicker(false)} />}        {/* Game board */}
//                 <div className="relative w-full h-[calc(100vh-8rem)]">
//                     {/* Render all player hands */}
//                     {Array.from({ length: numPlayers }).map((_, index) => renderPlayerHand(index))}
//
//                     {/* Center area with draw and discard piles */}
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
//                         {/* Draw pile */}
//                         <div className="relative">
//                             <CardBack
//                                 isDark={true}
//                                 onClick={gameState.currentPlayer === 0 && !isDrawing ? handleDrawCard : undefined}
//                                 className={`w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 ${
//                                     gameState.currentPlayer === 0 && !isDrawing
//                                         ? "cursor-pointer hover:scale-105"
//                                         : isDrawing
//                                             ? "opacity-75"
//                                             : ""
//                                 }`}
//                             />
//                         </div>
//
//                         {/* Discard pile - stacked cards */}
//                         <div className="relative">
//                             {/* Stack of cards */}
//                             {(gameState.visibleDiscardPile || [gameState.lastCard]).map((card, index, array) => {
//                                 const isTopCard = index === array.length - 1
//                                 // Calculate offset for each card in the stack
//                                 const offset = index * 3 // pixels
//                                 const rotation = (index - Math.floor(array.length / 2)) * 5 // degrees
//
//                                 return (
//                                     <div
//                                         key={`discard-${index}-${card.id}`}
//                                         className="absolute transition-all duration-300"
//                                         style={{
//                                             transform: `rotate(${rotation}deg) translate(${offset - 10}px, ${offset - 10}px)`,
//                                             zIndex: index,
//                                         }}
//                                     >
//                                         {card.type === "special" ? (
//                                             <WildCard
//                                                 className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
//                                                 onClick={() => {}}
//                                                 disabled={false}
//                                             />
//                                         ) : (
//                                             <UnoCard
//                                                 color={card.color}
//                                                 number={card.value}
//                                                 className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
//                                                 onClick={() => {}}
//                                                 disabled={false}
//                                             />
//                                         )}
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//
//                     {/* Say UNO button */}
//                     {gameState.players[0].length === 1 && !gameState.sayUno && (
//                         <div className="absolute bottom-4 right-4">
//                             <button
//                                 className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700"
//                                 onClick={handleSayUno}
//                             >
//                                 Say UNO!
//                             </button>
//                         </div>
//                     )}
//
//                     {/* Render all animations */}
//                     {renderAnimations()}
//                 </div>
//             </div>
//         )
//     }
//         Array(numPlayers)
//             .fill("")
//             .map((_, i) => `Player ${i + 1}`),
//     )
//     const [animatingCard, setAnimatingCard] = useState(null)
//     const [drawingPlayer, setDrawingPlayer] = useState(null)
//     const [animations, setAnimations] = useState([])
//     const [isDrawing, setIsDrawing] = useState(false) // New state to track drawing status
//     const tableRef = useRef(null)
//     const animationIdRef = useRef(0)
//     const windowSize = useRef({
//         width: typeof window !== "undefined" ? window.innerWidth : 1200,
//         height: typeof window !== "undefined" ? window.innerHeight : 800,
//     })
//
//     // Initialize game
//     const initGame = () => {
//         const deck = createDeck()
//         const { hands, deck: newDeck, discardPile } = dealCards(deck, numPlayers)
//
//         setGameState({
//             players: hands,
//             drawPile: newDeck,
//             discardPile,
//             currentPlayer: 0,
//             direction: 1,
//             currentColor: discardPile[0].color,
//             lastCard: discardPile[0],
//             sayUno: false,
//             visibleDiscardPile: [discardPile[0]], // Track visible cards in the discard pile
//         })
//
//         setWinner(null)
//         setGameStarted(true)
//         setAnimations([])
//         setIsDrawing(false)
//     }
//
//     // Update window size on resize
//     useEffect(() => {
//         const handleResize = () => {
//             windowSize.current = {
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             }
//         }
//
//         window.addEventListener("resize", handleResize)
//         handleResize() // Initial call
//
//         return () => window.removeEventListener("resize", handleResize)
//     }, [])
//
//     // Add a new animation
//     const addAnimation = (type, card, from, to, onComplete) => {
//         const id = animationIdRef.current++
//
//         // Add animation with improved timing and sequencing
//         setAnimations((prev) => [
//             ...prev,
//             {
//                 id,
//                 type,
//                 card,
//                 from,
//                 to,
//                 onComplete,
//                 startTime: Date.now(),
//             },
//         ])
//
//         // Auto-remove animation after it completes
//         // Use a longer duration to ensure smooth transitions
//         setTimeout(() => {
//             setAnimations((prev) => prev.filter((anim) => anim.id !== id))
//             if (onComplete) onComplete()
//         }, 800) // Slightly longer animation for smoother feel
//     }
//
//     // Handle drawing a card with animation
//     const handleDrawCard = () => {
//         // Prevent drawing if not player's turn, there's a winner, or already drawing
//         if (gameState.currentPlayer !== 0 || winner || isDrawing) return
//
//         // Set drawing state to prevent multiple draws
//         setIsDrawing(true)
//
//         // Check if the player already has a valid card to play
//         const hasPlayableCard = gameState.players[0].some(
//             (card) =>
//                 card.type === "special" ||
//                 card.color === gameState.currentColor ||
//                 (gameState.lastCard && card.value === gameState.lastCard.value),
//         )
//
//         // Generate a new random card instead of taking from the deck
//         const newCard = generateRandomCard()
//
//         // Add the card to the player's hand
//         setGameState((prev) => {
//             const newState = { ...prev }
//             newState.players[0] = [...newState.players[0], newCard]
//             return newState
//         })
//
//         // Add draw animation
//         addAnimation("draw", newCard, "drawPile", "player", () => {
//             // If player already had playable cards, only draw one card
//             if (hasPlayableCard) {
//                 setIsDrawing(false) // Reset drawing state after drawing one card
//             } else {
//                 // Check if the newly drawn card is playable
//                 const isNewCardPlayable =
//                     newCard.type === "special" ||
//                     newCard.color === gameState.currentColor ||
//                     (gameState.lastCard && newCard.value === gameState.lastCard.value)
//
//                 // If not playable, draw another card automatically after a short delay
//                 if (!isNewCardPlayable) {
//                     setTimeout(() => {
//                         setIsDrawing(false) // Reset drawing state before drawing again
//                         handleDrawCard()
//                     }, 300) // Short delay for better visual flow
//                 } else {
//                     // Card is playable, reset drawing state
//                     setIsDrawing(false)
//                 }
//             }
//         })
//     }
//
//     // Generate a random card for infinite deck
//     const generateRandomCard = () => {
//         const colors = ["red", "blue", "green", "yellow"]
//         const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
//         const specialTypes = ["Wild", "Wild4"]
//
//         // 20% chance of getting a special card
//         const isSpecial = Math.random() < 0.2
//
//         if (isSpecial) {
//             const specialValue = specialTypes[Math.floor(Math.random() * specialTypes.length)]
//             return {
//                 id: `special-${specialValue}-${Date.now()}`,
//                 color: "wild",
//                 value: specialValue,
//                 type: "special",
//             }
//         } else {
//             const color = colors[Math.floor(Math.random() * colors.length)]
//             const value = values[Math.floor(Math.random() * values.length)]
//             return {
//                 id: `${color}-${value}-${Date.now()}`,
//                 color,
//                 value,
//                 type: "number",
//             }
//         }
//     }
//
//     // Handle playing a card with animation
//     const handlePlayCard = (card, index) => {
//         if (gameState.currentPlayer !== 0 || winner || isDrawing) return
//
//         // Check if the card can be played
//         if (!canPlayCard(card, gameState.lastCard, gameState.currentColor)) {
//             return
//         }
//
//         // Handle wild cards
//         if (card.type === "special") {
//             setPendingWildCard({ card, index })
//             setShowColorPicker(true)
//             return
//         }
//
//         // First visually remove the card from the hand
//         setGameState((prev) => {
//             const newState = { ...prev }
//             // Create a temporary copy without the card to be played
//             // This makes it visually disappear from the hand
//             const tempHand = [...newState.players[0]]
//             tempHand.splice(index, 1)
//             newState.players[0] = tempHand
//             return newState
//         })
//
//         // Then add play animation
//         setTimeout(() => {
//             addAnimation("play", card, "player", "discardPile", () => {
//                 playCard(card, index, card.color)
//             })
//         }, 50) // Small delay to ensure the card is visually removed first
//     }
//
//     // Play a card with the selected color (for wild cards)
//     const playCard = (card, index, selectedColor) => {
//         setGameState((prev) => {
//             const newState = { ...prev }
//
//             // Remove the card from the player's hand
//             const playerHand = [...newState.players[newState.currentPlayer]]
//             playerHand.splice(index, 1)
//             newState.players[newState.currentPlayer] = playerHand
//
//             // Add the card to the discard pile
//             newState.discardPile = [...newState.discardPile, card]
//             newState.lastCard = card
//
//             // Update the visible discard pile (keep last 5 cards)
//             newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), card].slice(-5)
//
//             // Update the current color
//             newState.currentColor = selectedColor || card.color
//
//             // Apply card effects
//             const { nextPlayer, direction, drawCount } = applyCardEffect(newState, card)
//             newState.currentPlayer = nextPlayer
//             newState.direction = direction
//
//             // Handle draw cards
//             if (drawCount > 0) {
//                 for (let i = 0; i < drawCount; i++) {
//                     if (newState.drawPile.length === 0) {
//                         // Reshuffle if needed
//                         const topCard = newState.discardPile.pop()
//                         newState.drawPile = [...newState.discardPile].sort(() => Math.random() - 0.5)
//                         newState.discardPile = [topCard]
//                     }
//
//                     const drawnCard = newState.drawPile.pop()
//                     newState.players[nextPlayer] = [...newState.players[nextPlayer], drawnCard]
//                 }
//             }
//
//             // Check for winner
//             if (playerHand.length === 0) {
//                 setWinner(newState.currentPlayer)
//                 return newState
//             }
//
//             // AI players will play automatically
//             setTimeout(() => {
//                 playAITurn()
//             }, 2)
//
//             return newState
//         })
//     }
//
//     // Handle color selection for wild cards
//     const handleColorSelect = (color) => {
//         setShowColorPicker(false)
//         if (pendingWildCard) {
//             // First visually remove the card from the hand
//             setGameState((prev) => {
//                 const newState = { ...prev }
//                 // Create a temporary copy without the card to be played
//                 const tempHand = [...newState.players[0]]
//                 tempHand.splice(pendingWildCard.index, 1)
//                 newState.players[0] = tempHand
//                 return newState
//             })
//
//             // Then add play animation
//             setTimeout(() => {
//                 addAnimation("play", pendingWildCard.card, "player", "discardPile", () => {
//                     playCard(pendingWildCard.card, pendingWildCard.index, color)
//                     setPendingWildCard(null)
//                 })
//             }, 50)
//         }
//     }
//
//     // AI player turn logic with animations
//     const playAITurn = () => {
//         if (!gameState || gameState.currentPlayer === 0 || winner) return
//
//         const currentPlayerIndex = gameState.currentPlayer
//         const playerHand = gameState.players[currentPlayerIndex]
//
//         // Find playable cards
//         const playableCards = playerHand.filter(
//             (card) =>
//                 card.type === "special" || card.color === gameState.currentColor || card.value === gameState.lastCard.value,
//         )
//
//         if (playableCards.length > 0) {
//             // Choose a card to play (simple AI strategy)
//             const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)]
//             const cardIndex = playerHand.findIndex((c) => c.id === cardToPlay.id)
//
//             // First visually remove the card from the AI hand
//             setGameState((prev) => {
//                 const newState = { ...prev }
//                 const tempHand = [...newState.players[currentPlayerIndex]]
//                 tempHand.splice(cardIndex, 1)
//                 newState.players[currentPlayerIndex] = tempHand
//                 return newState
//             })
//
//             // Then add play animation for AI
//             setTimeout(() => {
//                 const playerPosition = getPlayerPosition(currentPlayerIndex).position
//                 addAnimation("play", cardToPlay, playerPosition, "discardPile", () => {
//                     setGameState((prev) => {
//                         const newState = { ...prev }
//
//                         // Remove the card from the player's hand
//                         const newPlayerHand = [...playerHand]
//                         newPlayerHand.splice(cardIndex, 1)
//                         newState.players[currentPlayerIndex] = newPlayerHand
//
//                         // Add the card to the discard pile
//                         newState.discardPile = [...newState.discardPile, cardToPlay]
//                         newState.lastCard = cardToPlay
//
//                         // Update the visible discard pile (keep last 5 cards)
//                         newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), cardToPlay].slice(-5)
//
//                         // Handle wild cards
//                         if (cardToPlay.type === "special") {
//                             // AI chooses a color (simple strategy: choose the most common color in hand)
//                             const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 }
//                             newPlayerHand.forEach((c) => {
//                                 if (c.color !== "wild") {
//                                     colorCounts[c.color]++
//                                 }
//                             })
//
//                             let maxColor = "red"
//                             let maxCount = 0
//                             Object.entries(colorCounts).forEach(([color, count]) => {
//                                 if (count > maxCount) {
//                                     maxColor = color
//                                     maxCount = count
//                                 }
//                             })
//
//                             newState.currentColor = maxColor
//                         } else {
//                             newState.currentColor = cardToPlay.color
//                         }
//
//                         // Apply card effects
//                         const { nextPlayer, direction, drawCount } = applyCardEffect(newState, cardToPlay)
//                         newState.currentPlayer = nextPlayer
//                         newState.direction = direction
//
//                         // Handle draw cards with sequential animations
//                         if (drawCount > 0) {
//                             // Create a sequence of animations with proper timing
//                             const animateDrawSequence = (index) => {
//                                 if (index >= drawCount) {
//                                     // All animations complete, continue game
//                                     if (newState.currentPlayer !== 0) {
//                                         setTimeout(() => playAITurn(), 500)
//                                     }
//                                     return
//                                 }
//
//                                 // Generate a random card
//                                 const drawnCard = generateRandomCard()
//
//                                 // Add the card to the player's hand
//                                 newState.players[nextPlayer].push(drawnCard)
//
//                                 // Add draw animation with chained callback
//                                 addAnimation("draw", drawnCard, "drawPile", getPlayerPosition(nextPlayer).position, () => {
//                                     // Chain to the next animation
//                                     setTimeout(() => {
//                                         animateDrawSequence(index + 1)
//                                     }, 200) // Short delay between sequential draws
//                                 })
//                             }
//
//                             // Start the animation sequence
//                             animateDrawSequence(0)
//
//                             return newState
//                         }
//
//                         // Check for winner
//                         if (newPlayerHand.length === 0) {
//                             setWinner(currentPlayerIndex)
//                             return newState
//                         }
//
//                         // Continue AI turns if the next player is also AI
//                         if (newState.currentPlayer !== 0) {
//                             setTimeout(() => {
//                                 playAITurn()
//                             }, 800)
//                         }
//
//                         return newState
//                     })
//                 })
//             }, 50)
//         } else {
//             // AI needs to draw a card
//             // Generate a random card instead of taking from the deck
//             const drawnCard = generateRandomCard()
//
//             // Update state with the new card
//             setGameState((prev) => {
//                 const newState = { ...prev }
//                 // Add the card to the player's hand immediately
//                 newState.players[currentPlayerIndex].push(drawnCard)
//                 return newState
//             })
//
//             // Add draw animation for AI with improved timing
//             const playerPosition = getPlayerPosition(currentPlayerIndex).position
//             addAnimation("draw", drawnCard, "drawPile", playerPosition, () => {
//                 // Check if the drawn card can be played
//                 if (canPlayCard(drawnCard, gameState.lastCard, gameState.currentColor)) {
//                     // Recursively call AI turn to play the card
//                     setTimeout(() => {
//                         playAITurn()
//                     }, 600)
//                 } else {
//                     // Draw another card since this one can't be played
//                     setTimeout(() => {
//                         playAITurn()
//                     }, 600)
//                 }
//             })
//         }
//     }
//
//     // Say UNO button handler
//     const handleSayUno = () => {
//         if (gameState.players[0].length === 1) {
//             setGameState((prev) => ({
//                 ...prev,
//                 sayUno: true,
//             }))
//         }
//     }
//
//     // Get player position based on player index and total number of players
//     const getPlayerPosition = (playerIndex) => {
//         // Player 0 is always at the bottom
//         if (playerIndex === 0) return { position: "bottom", rotation: 0 }
//
//         if (numPlayers === 3) {
//             // 3 player layout: bottom, top-left, top-right
//             if (playerIndex === 1) return { position: "top-left", rotation: -20 }
//             if (playerIndex === 2) return { position: "top-right", rotation: 20 }
//         } else if (numPlayers === 4) {
//             // 4 player layout: bottom, left, top, right
//             if (playerIndex === 1) return { position: "left", rotation: 90 }
//             if (playerIndex === 2) return { position: "top", rotation: 0 }
//             if (playerIndex === 3) return { position: "right", rotation: -90 }
//         } else if (numPlayers === 5) {
//             // 5 player layout: bottom, left, top-left, top-right, right
//             if (playerIndex === 1) return { position: "left", rotation: 90 }
//             if (playerIndex === 2) return { position: "top-left", rotation: -20 }
//             if (playerIndex === 3) return { position: "top-right", rotation: 20 }
//             if (playerIndex === 4) return { position: "right", rotation: -90 }
//         } else if (numPlayers === 6) {
//             // 6 player layout: bottom, left, top-left, top, top-right, right
//             if (playerIndex === 1) return { position: "left", rotation: 90 }
//             if (playerIndex === 2) return { position: "top-left", rotation: -20 }
//             if (playerIndex === 3) return { position: "top", rotation: 0 }
//             if (playerIndex === 4) return { position: "top-right", rotation: 20 }
//             if (playerIndex === 5) return { position: "right", rotation: -90 }
//         }
//
//         // Default fallback
//         return { position: "top", rotation: 0 }
//     }
//
//     // Get position coordinates for animations
//     const getPositionCoordinates = (position) => {
//         // Use window dimensions or fixed values based on the game board
//         const centerX = windowSize.current.width / 2
//         const centerY = windowSize.current.height / 2
//
//         switch (position) {
//             case "drawPile":
//                 return { x: centerX - 60, y: centerY }
//             case "discardPile":
//                 // Add slight randomness to the landing position for a more natural stack
//                 const randomX = Math.random() * 10 - 5
//                 const randomY = Math.random() * 10 - 5
//                 return { x: centerX + 60 + randomX, y: centerY + randomY }
//             case "player":
//             case "bottom":
//                 return { x: centerX, y: centerY + 200 }
//             case "top":
//                 return { x: centerX, y: centerY - 200 }
//             case "top-left":
//                 return { x: centerX - 180, y: centerY - 180 }
//             case "top-right":
//                 return { x: centerX + 180, y: centerY - 180 }
//             case "left":
//                 return { x: centerX - 270, y: centerY - 20 } // Adjusted to be higher
//             case "right":
//                 return { x: centerX + 270, y: centerY - 20 } // Adjusted to be higher
//             default:
//                 return { x: centerX, y: centerY }
//         }
//     }
//
//     // Start a new game
//     useEffect(() => {
//         if (!gameStarted) {
//             initGame()
//         }
//     }, [gameStarted])
//
//     if (!gameState) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-[#3E8914]">
//                 <button
//                     className="px-6 py-3 bg-black text-white rounded-lg text-xl font-bold shadow-lg hover:bg-gray-800 transition-colors"
//                     onClick={initGame}
//                 >
//                     Start Game
//                 </button>
//             </div>
//         )
//     }
//
//     // Render player's hand with fan effect
//     const renderPlayerHand = (playerIndex) => {
//         if (!gameState.players[playerIndex]) return null
//
//         const { position, rotation } = getPlayerPosition(playerIndex)
//         const isCurrentPlayer = gameState.currentPlayer === playerIndex
//         const cards = gameState.players[playerIndex]
//         const totalCards = cards.length
//
//         // Calculate fan properties based on position
//         let fanWidth, fanHeight, transformOrigin, baseTransform
//
//         let containerStyle = {} // Define containerStyle here
//
//         switch (position) {
//             case "bottom":
//                 // Calculate fan width based on number of cards, but ensure it's centered
//                 fanWidth = Math.min(totalCards * 20, 400) // Limit max width
//                 transformOrigin = "bottom center"
//                 // This transform ensures cards grow from the center
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20 // 20px spacing between cards
//                     const angle = (index - centerIndex) * 3 // 3 degrees rotation per card
//                     return `translateX(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     bottom: "4rem",
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     width: "100%",
//                     maxWidth: "800px",
//                     display: "flex",
//                     justifyContent: "center",
//                 }
//                 break
//             case "top":
//                 fanWidth = Math.min(totalCards * 20, 300)
//                 transformOrigin = "top center"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3
//                     return `translateX(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     top: "4rem",
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     width: "100%",
//                     maxWidth: "400px",
//                     display: "flex",
//                     justifyContent: "center",
//                 }
//                 break
//             case "top-left":
//                 fanWidth = Math.min(totalCards * 20, 250)
//                 transformOrigin = "top center"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3 - 20 // -20 degree base rotation
//                     return `translateX(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     top: "4rem",
//                     left: "25%",
//                     transform: "translateX(-50%)",
//                     width: "100%",
//                     maxWidth: "300px",
//                     display: "flex",
//                     justifyContent: "center",
//                 }
//                 break
//             case "top-right":
//                 fanWidth = Math.min(totalCards * 20, 250)
//                 transformOrigin = "top center"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3 + 20 // +20 degree base rotation
//                     return `translateX(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     top: "4rem",
//                     right: "25%",
//                     transform: "translateX(50%)",
//                     width: "100%",
//                     maxWidth: "300px",
//                     display: "flex",
//                     justifyContent: "center",
//                 }
//                 break
//             case "left":
//                 fanHeight = Math.min(totalCards * 20, 250)
//                 transformOrigin = "center right"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3 + 90 // +90 degree base rotation
//                     return `translateY(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     top: "40%", // Move up from 50% to 40% to match the screenshot
//                     left: "4rem",
//                     transform: "translateY(-50%)",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     height: "300px",
//                 }
//                 break
//             case "right":
//                 fanHeight = Math.min(totalCards * 20, 250)
//                 transformOrigin = "center left"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3 - 90 // -90 degree base rotation
//                     return `translateY(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     top: "40%", // Move up from 50% to 40% to match the screenshot
//                     right: "4rem",
//                     transform: "translateY(-50%)",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     height: "300px",
//                 }
//                 break
//             default:
//                 fanWidth = Math.min(totalCards * 20, 300)
//                 transformOrigin = "bottom center"
//                 baseTransform = (index, totalCards) => {
//                     const centerIndex = (totalCards - 1) / 2
//                     const offset = (index - centerIndex) * 20
//                     const angle = (index - centerIndex) * 3
//                     return `translateX(${offset}px) rotate(${angle}deg)`
//                 }
//                 containerStyle = {
//                     bottom: "4rem",
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     width: "100%",
//                     maxWidth: "800px",
//                     display: "flex",
//                     justifyContent: "center",
//                 }
//         }
//
//         return (
//             <div className={`absolute ${isCurrentPlayer ? "z-10" : ""} player-${position}`} style={containerStyle}>
//                 {/* Player name with improved positioning */}
//                 <div
//                     className="player-name-tag"
//                     style={{
//                         position: "absolute",
//                         left: "50%",
//                         top: position === "top" || position.includes("top") ? "-3.5rem" : "auto",
//                         bottom: position === "bottom" ? "-3.5rem" : "auto",
//                         right: "auto",
//                         transform: "translateX(-50%)",
//                         zIndex: 30,
//                     }}
//                 >
//           <span className="bg-black/70 text-white font-bold px-3 py-1 rounded-md whitespace-nowrap">
//             {playerNames[playerIndex]} {isCurrentPlayer ? "(Playing)" : ""}
//           </span>
//                 </div>
//
//                 <div
//                     className="relative"
//                     style={{
//                         height: position.includes("left") || position.includes("right") ? "250px" : "120px",
//                         width: "100%",
//                         display: "flex",
//                         justifyContent: "center",
//                     }}
//                 >
//                     {cards.map((card, index) => {
//                         const canPlay =
//                             isCurrentPlayer &&
//                             (card.type === "special" ||
//                                 card.color === gameState.currentColor ||
//                                 (gameState.lastCard && card.value === gameState.lastCard.value))
//
//                         // For player 0 (user), we need special handling for playable cards
//                         const transform = baseTransform(index, totalCards)
//                         const hoverTransform =
//                             playerIndex === 0 && canPlay ? `${baseTransform(index, totalCards)} translateY(-30px)` : transform
//
//                         return (
//                             <div
//                                 key={playerIndex === 0 ? card.id : `${playerIndex}-${index}`}
//                                 className="absolute transition-all duration-200"
//                                 style={{
//                                     transform: playerIndex === 0 && canPlay ? `${transform} translateY(-10px)` : transform,
//                                     transformOrigin: transformOrigin,
//                                     zIndex: index,
//                                 }}
//                                 onMouseEnter={
//                                     playerIndex === 0 && canPlay
//                                         ? (e) => {
//                                             e.currentTarget.style.transform = hoverTransform
//                                         }
//                                         : undefined
//                                 }
//                                 onMouseLeave={
//                                     playerIndex === 0 && canPlay
//                                         ? (e) => {
//                                             e.currentTarget.style.transform = `${transform} translateY(-10px)`
//                                         }
//                                         : undefined
//                                 }
//                             >
//                                 {playerIndex === 0 ? (
//                                     card.type === "special" ? (
//                                         <WildCard
//                                             onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
//                                             disabled={!canPlay}
//                                             className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                         />
//                                     ) : (
//                                         <UnoCard
//                                             color={card.color}
//                                             number={card.value}
//                                             onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
//                                             disabled={!canPlay}
//                                             className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                         />
//                                     )
//                                 ) : (
//                                     <CardBack isDark={true} className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40" onClick={() => {}} />                    )}
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>
//         )
//     }
//
//     // Render animations
//     const renderAnimations = () => {
//         return (
//             <AnimatePresence mode="sync">
//                 {animations.map((anim) => {
//                     const fromPos = getPositionCoordinates(anim.from)
//                     const toPos = getPositionCoordinates(anim.to)
//
//                     // Determine rotation based on positions
//                     let fromRotation = 0
//                     if (anim.from === "left") fromRotation = 90
//                     if (anim.from === "right") fromRotation = -90
//
//                     let toRotation = 0
//                     if (anim.to === "left") toRotation = 90
//                     if (anim.to === "right") toRotation = -90
//
//                     // Animation variants with improved transitions - properly typed for Framer Motion
//                     const variants = {
//                         initial: {
//                             x: fromPos.x - 40, // Adjust for card width
//                             y: fromPos.y - 60, // Adjust for card height
//                             scale: 1,
//                             rotate: fromRotation,
//                             zIndex: 100,
//                             opacity: 1,
//                             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                         },
//                         animate: {
//                             x: toPos.x - 40, // Adjust for card width
//                             y: toPos.y - 60, // Adjust for card height
//                             scale: [1, 1.1, 1], // Smoother scale effect
//                             rotate: toRotation,
//                             zIndex: 100,
//                             opacity: 1,
//                             boxShadow: [
//                                 "0 4px 8px rgba(0, 0, 0, 0.2)",
//                                 "0 8px 16px rgba(0, 0, 0, 0.3)",
//                                 "0 4px 8px rgba(0, 0, 0, 0.2)",
//                             ],
//                             transition: {
//                                 duration: 0.8, // Longer duration for smoother motion
//                                 ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
//                                 scale: {
//                                     times: [0, 0.5, 1],
//                                     duration: 0.8,
//                                 },
//                                 boxShadow: {
//                                     times: [0, 0.5, 1],
//                                     duration: 0.8,
//                                 },
//                             },
//                         },
//                         exit: {
//                             opacity: 0,
//                             transition: { duration: 0.3 },
//                         },
//                     }
//
//                     return (
//                         <motion.div
//                             key={anim.id}
//                             style={{ width: "80px", height: "120px", position: "fixed" }}
//                             initial="initial"
//                             animate="animate"
//                             exit="exit"
//                             variants={variants}
//                             onAnimationComplete={anim.onComplete}
//                         >
//                             {anim.card.type === "special" ? (
//                                 <WildCard
//                                     className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                     onClick={() => {}}
//                                     disabled={false}
//                                 />
//                             ) : (
//                                 <UnoCard
//                                     color={anim.card.color}
//                                     number={anim.card.value}
//                                     className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
//                                     onClick={() => {}}
//                                     disabled={false}
//                                 />
//                             )}
//                         </motion.div>
//                     )
//                 })}
//             </AnimatePresence>
//         )
//     }
//
//     // Function to shuffle the deck
//     const shuffleDeck = (deck) => {
//         const newDeck = [...deck]
//         for (let i = newDeck.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1))
//             ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
//         }
//         return newDeck
//     }
//
//     return (
//         <div className="min-h-screen bg-[#3E8914] relative overflow-hidden" ref={tableRef}>
//             {/* Winner announcement */}
//             {winner !== null && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//                     <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
//                         <h2 className="text-3xl font-bold mb-4">{winner === 0 ? "You Win!" : `${playerNames[winner]} Wins!`}</h2>
//                         <button
//                             className="px-6 py-3 bg-[#3E8914] text-white rounded-lg text-xl font-bold shadow-lg hover:bg-[#2d6610] transition-colors"
//                             onClick={initGame}
//                         >
//                             Play Again
//                         </button>
//                     </div>
//                 </div>
//             )}
//
//             {/* Color picker for wild cards */}
//             {showColorPicker && <ColorPicker onSelectColor={handleColorSelect} onClose={() => setShowColorPicker(false)} />}        {/* Game board */}
//             <div className="relative w-full h-[calc(100vh-8rem)]">
//                 {/* Render all player hands */}
//                 {Array.from({ length: numPlayers }).map((_, index) => renderPlayerHand(index))}
//
//                 {/* Center area with draw and discard piles */}
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
//                     {/* Draw pile */}
//                     <div className="relative">
//                         <CardBack
//                             isDark={true}
//                             onClick={gameState.currentPlayer === 0 && !isDrawing ? handleDrawCard : undefined}
//                             className={`w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 ${
//                                 gameState.currentPlayer === 0 && !isDrawing
//                                     ? "cursor-pointer hover:scale-105"
//                                     : isDrawing
//                                         ? "opacity-75"
//                                         : ""
//                             }`}
//                         />
//                     </div>
//
//                     {/* Discard pile - stacked cards */}
//                     <div className="relative">
//                         {/* Stack of cards */}
//                         {(gameState.visibleDiscardPile || [gameState.lastCard]).map((card, index, array) => {
//                             const isTopCard = index === array.length - 1
//                             // Calculate offset for each card in the stack
//                             const offset = index * 3 // pixels
//                             const rotation = (index - Math.floor(array.length / 2)) * 5 // degrees
//
//                             return (
//                                 <div
//                                     key={`discard-${index}-${card.id}`}
//                                     className="absolute transition-all duration-300"
//                                     style={{
//                                         transform: `rotate(${rotation}deg) translate(${offset - 10}px, ${offset - 10}px)`,
//                                         zIndex: index,
//                                     }}
//                                 >
//                                     {card.type === "special" ? (
//                                         <WildCard
//                                             className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
//                                             onClick={() => {}}
//                                             disabled={false}
//                                         />
//                                     ) : (
//                                         <UnoCard
//                                             color={card.color}
//                                             number={card.value}
//                                             className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
//                                             onClick={() => {}}
//                                             disabled={false}
//                                         />
//                                     )}
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>
//
//                 {/* Say UNO button */}
//                 {gameState.players[0].length === 1 && !gameState.sayUno && (
//                     <div className="absolute bottom-4 right-4">
//                         <button
//                             className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700"
//                             onClick={handleSayUno}
//                         >
//                             Say UNO!
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Render all animations */}
//                 {renderAnimations()}
//             </div>
//         </div>
//     )
// }