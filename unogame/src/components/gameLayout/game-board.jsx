"use client"

import { useState, useEffect, useRef } from "react"
import { UnoCard, WildCard, CardBack, ColorPicker } from "./cards/cards"
import GameService from "../../lib/gameService"
import { motion, AnimatePresence } from "framer-motion"

export function GameBoard({ gameID, playerID }) {
  // Remove the showJoinForm state and related functionality
  const [lobbyID, setLobbyID] = useState(gameID || null)
  const [playerIdentifier, setPlayerIdentifier] = useState(playerID || null)
  const [gameState, setGameState] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingWildCard, setPendingWildCard] = useState(null)
  const [winner, setWinner] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerNames, setPlayerNames] = useState([])
  const [animatingCard, setAnimatingCard] = useState(null)
  const [drawingPlayer, setDrawingPlayer] = useState(null)
  const [animations, setAnimations] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const tableRef = useRef(null)
  const animationIdRef = useRef(0)
  const windowSize = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  // Initialize game when gameID and playerID are provided
  useEffect(() => {
    if (gameID && playerID) {
      setLobbyID(gameID)
      setPlayerIdentifier(playerID)
      setGameStarted(true)
    }
  }, [gameID, playerID])

  // Fetch game state at regular intervals
  useEffect(() => {
    if (!lobbyID || !playerIdentifier) return

    const fetchGameState = async () => {
      try {
        const response = await GameService.fetchGameState(lobbyID, playerIdentifier)
        if (response.success) {
          setGameState(transformApiGameState(response.gameState))

          // Update player names if available
          if (response.gameState.players) {
            const names = response.gameState.players.map((player) => player.username || `Player ${player.playerID}`)
            setPlayerNames(names)
          }

          // Check for winner
          if (response.gameState.gameStatus === "ended") {
            setWinner(response.gameState.winner || response.gameState.currentPlayer)
          }
        } else {
          setMessage(response.message)
        }
      } catch (error) {
        setMessage("Failed to fetch game state")
      }
    }

    // Initial fetch
    fetchGameState()

    // Set up polling
    const interval = setInterval(fetchGameState, 2000)
    return () => clearInterval(interval)
  }, [lobbyID, playerIdentifier])

  // Transform API game state to match our UI format
  const transformApiGameState = (apiGameState) => {
    if (!apiGameState) return null

    // Parse current card
    const currentCardParts = apiGameState.currentCard ? apiGameState.currentCard.split("_") : []
    let currentColor = currentCardParts[0]
    const currentValue = currentCardParts[1]

    // Handle wild cards with chosen color
    if (currentColor === "wild" && currentCardParts.length > 2) {
      currentColor = currentCardParts[2]
    }

    // Transform player hands
    const players = apiGameState.players.map((player) => {
      // Transform cards to our format
      const transformedHand = player.hand
          ? player.hand.map((card) => {
            const parts = card.split("_")
            const color = parts[0]
            const value = parts[1]

            return {
              id: `${color}-${value}-${Math.random()}`,
              color,
              value,
              type: color === "wild" ? "special" : "number",
            }
          })
          : []

      return transformedHand
    })

    // Create a discard pile with the current card
    const currentCardObj = {
      id: `${currentColor}-${currentValue}-top`,
      color: currentCardParts[0], // Original color (might be 'wild')
      value: currentValue,
      type: currentCardParts[0] === "wild" ? "special" : "number",
    }

    return {
      players,
      currentPlayer: apiGameState.currentPlayer,
      direction: apiGameState.gameOrder || 1,
      currentColor,
      lastCard: currentCardObj,
      discardPile: [currentCardObj],
      visibleDiscardPile: [currentCardObj],
      sayUno: false,
    }
  }

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial call

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add a new animation
  const addAnimation = (type, card, from, to, onComplete) => {
    const id = animationIdRef.current++

    // Add animation with improved timing and sequencing
    setAnimations((prev) => [
      ...prev,
      {
        id,
        type,
        card,
        from,
        to,
        onComplete,
        startTime: Date.now(),
      },
    ])

    // Auto-remove animation after it completes
    // Use a longer duration to ensure smooth transitions
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== id))
      if (onComplete) onComplete()
    }, 800) // Slightly longer animation for smoother feel
  }

  // Handle drawing a card with animation
  const handleDrawCard = async () => {
    // Prevent drawing if not player's turn, there's a winner, or already drawing
    if (!gameState || gameState.currentPlayer !== playerIdentifier || winner || isDrawing || loading) return

    setIsDrawing(true)
    setLoading(true)

    try {
      const response = await GameService.drawCard(lobbyID, playerIdentifier)
      setMessage(response.message)

      if (response.success && response.drawnCard) {
        // Parse the drawn card
        const parts = response.drawnCard.split("_")
        const color = parts[0]
        const value = parts[1]

        const newCard = {
          id: `${color}-${value}-${Date.now()}`,
          color,
          value,
          type: color === "wild" ? "special" : "number",
        }

        // Add draw animation
        addAnimation("draw", newCard, "drawPile", "player", () => {
          // Update game state after animation completes
          GameService.fetchGameState(lobbyID, playerIdentifier).then((stateResponse) => {
            if (stateResponse.success) {
              setGameState(transformApiGameState(stateResponse.gameState))
            }
            setIsDrawing(false)
            setLoading(false)
          })
        })
      } else {
        setIsDrawing(false)
        setLoading(false)
      }
    } catch (error) {
      setMessage("Failed to draw card")
      setIsDrawing(false)
      setLoading(false)
    }
  }

  // Handle playing a card with animation
  const handlePlayCard = (card, index) => {
    if (!gameState || gameState.currentPlayer !== playerIdentifier || winner || isDrawing || loading) return

    // Check if it's a wild card
    if (card.type === "special") {
      setPendingWildCard({ card, index })
      setShowColorPicker(true)
      return
    }

    playCardWithAnimation(card, index, null)
  }

  // Play a card with animation
  const playCardWithAnimation = async (card, index, selectedColor) => {
    setLoading(true)

    // First visually remove the card from the hand
    setGameState((prev) => {
      if (!prev) return prev
      const newState = { ...prev }
      // Create a temporary copy without the card to be played
      const tempHand = [...newState.players[0]]
      tempHand.splice(index, 1)
      newState.players[0] = tempHand
      return newState
    })

    // Format the card for the API
    let cardString
    if (card.type === "special") {
      cardString = `wild_${card.value}`
    } else {
      cardString = `${card.color}_${card.value}`
    }

    // Add play animation
    addAnimation("play", card, "player", "discardPile", async () => {
      try {
        const response = await GameService.playCard(lobbyID, playerIdentifier, cardString, selectedColor)
        setMessage(response.message)

        if (response.success) {
          // Update game state after successful play
          const stateResponse = await GameService.fetchGameState(lobbyID, playerIdentifier)
          if (stateResponse.success) {
            setGameState(transformApiGameState(stateResponse.gameState))

            // Check for winner
            if (stateResponse.gameState.gameStatus === "ended") {
              setWinner(stateResponse.gameState.winner || stateResponse.gameState.currentPlayer)
            }
          }
        }
      } catch (error) {
        setMessage("Failed to play card")
      }
      setLoading(false)
    })
  }

  // Handle color selection for wild cards
  const handleColorSelect = (color) => {
    setShowColorPicker(false)
    if (pendingWildCard) {
      playCardWithAnimation(pendingWildCard.card, pendingWildCard.index, color)
      setPendingWildCard(null)
    }
  }

  // Say UNO button handler
  const handleSayUno = () => {
    if (gameState && gameState.players[0].length === 1) {
      setGameState((prev) => ({
        ...prev,
        sayUno: true,
      }))
      setMessage("You said UNO!")
    }
  }

  // Get player position based on player index and total number of players
  const getPlayerPosition = (playerIndex) => {
    const numPlayers = gameState?.players?.length || 6

    // Player 0 is always at the bottom
    if (playerIndex === 0) return { position: "bottom", rotation: 0 }

    if (numPlayers === 3) {
      // 3 player layout: bottom, top-left, top-right
      if (playerIndex === 1) return { position: "top-left", rotation: -20 }
      if (playerIndex === 2) return { position: "top-right", rotation: 20 }
    } else if (numPlayers === 4) {
      // 4 player layout: bottom, left, top, right
      if (playerIndex === 1) return { position: "left", rotation: 90 }
      if (playerIndex === 2) return { position: "top", rotation: 0 }
      if (playerIndex === 3) return { position: "right", rotation: -90 }
    } else if (numPlayers === 5) {
      // 5 player layout: bottom, left, top-left, top-right, right
      if (playerIndex === 1) return { position: "left", rotation: 90 }
      if (playerIndex === 2) return { position: "top-left", rotation: -20 }
      if (playerIndex === 3) return { position: "top-right", rotation: 20 }
      if (playerIndex === 4) return { position: "right", rotation: -90 }
    } else if (numPlayers === 6) {
      // 6 player layout: bottom, left, top-left, top, top-right, right
      if (playerIndex === 1) return { position: "left", rotation: 90 }
      if (playerIndex === 2) return { position: "top-left", rotation: -20 }
      if (playerIndex === 3) return { position: "top", rotation: 0 }
      if (playerIndex === 4) return { position: "top-right", rotation: 20 }
      if (playerIndex === 5) return { position: "right", rotation: -90 }
    }

    // Default fallback
    return { position: "top", rotation: 0 }
  }

  // Get position coordinates for animations
  const getPositionCoordinates = (position) => {
    // Use window dimensions or fixed values based on the game board
    const centerX = windowSize.current.width / 2
    const centerY = windowSize.current.height / 2

    switch (position) {
      case "drawPile":
        return { x: centerX - 60, y: centerY }
      case "discardPile":
        // Add slight randomness to the landing position for a more natural stack
        const randomX = Math.random() * 10 - 5
        const randomY = Math.random() * 10 - 5
        return { x: centerX + 60 + randomX, y: centerY + randomY }
      case "player":
      case "bottom":
        return { x: centerX, y: centerY + 200 }
      case "top":
        return { x: centerX, y: centerY - 200 }
      case "top-left":
        return { x: centerX - 180, y: centerY - 180 }
      case "top-right":
        return { x: centerX + 180, y: centerY - 180 }
      case "left":
        return { x: centerX - 270, y: centerY - 20 } // Adjusted to be higher
      case "right":
        return { x: centerX + 270, y: centerY - 20 } // Adjusted to be higher
      default:
        return { x: centerX, y: centerY }
    }
  }

  // Loading state when waiting for game state
  if (!gameState) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#3E8914]">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl">Loading game...</p>
            {message && <p className="mt-2">{message}</p>}
          </div>
        </div>
    )
  }

  // Render player's hand with fan effect
  const renderPlayerHand = (playerIndex) => {
    if (!gameState.players[playerIndex]) return null

    const { position, rotation } = getPlayerPosition(playerIndex)
    const isCurrentPlayer = gameState.currentPlayer === playerIndex
    const cards = gameState.players[playerIndex]
    const totalCards = cards.length

    // Calculate fan properties based on position
    let fanWidth, fanHeight, transformOrigin, baseTransform

    let containerStyle = {} // Define containerStyle here

    switch (position) {
      case "bottom":
        // Calculate fan width based on number of cards, but ensure it's centered
        fanWidth = Math.min(totalCards * 20, 400) // Limit max width
        transformOrigin = "bottom center"
        // This transform ensures cards grow from the center
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20 // 20px spacing between cards
          const angle = (index - centerIndex) * 3 // 3 degrees rotation per card
          return `translateX(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          bottom: "4rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "center",
        }
        break
      case "top":
        fanWidth = Math.min(totalCards * 20, 300)
        transformOrigin = "top center"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3
          return `translateX(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          top: "4rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "center",
        }
        break
      case "top-left":
        fanWidth = Math.min(totalCards * 20, 250)
        transformOrigin = "top center"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3 - 20 // -20 degree base rotation
          return `translateX(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          top: "4rem",
          left: "25%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          justifyContent: "center",
        }
        break
      case "top-right":
        fanWidth = Math.min(totalCards * 20, 250)
        transformOrigin = "top center"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3 + 20 // +20 degree base rotation
          return `translateX(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          top: "4rem",
          right: "25%",
          transform: "translateX(50%)",
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          justifyContent: "center",
        }
        break
      case "left":
        fanHeight = Math.min(totalCards * 20, 250)
        transformOrigin = "center right"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3 + 90 // +90 degree base rotation
          return `translateY(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          top: "40%", // Move up from 50% to 40% to match the screenshot
          left: "4rem",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "300px",
        }
        break
      case "right":
        fanHeight = Math.min(totalCards * 20, 250)
        transformOrigin = "center left"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3 - 90 // -90 degree base rotation
          return `translateY(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          top: "40%", // Move up from 50% to 40% to match the screenshot
          right: "4rem",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "300px",
        }
        break
      default:
        fanWidth = Math.min(totalCards * 20, 300)
        transformOrigin = "bottom center"
        baseTransform = (index, totalCards) => {
          const centerIndex = (totalCards - 1) / 2
          const offset = (index - centerIndex) * 20
          const angle = (index - centerIndex) * 3
          return `translateX(${offset}px) rotate(${angle}deg)`
        }
        containerStyle = {
          bottom: "4rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "center",
        }
    }

    // For API integration, we need to determine if this is the current player's hand
    const isPlayerHand = playerIndex === 0

    return (
        <div className={`absolute ${isCurrentPlayer ? "z-10" : ""} player-${position}`} style={containerStyle}>
          {/* Player name with improved positioning */}
          <div
              className="player-name-tag"
              style={{
                position: "absolute",
                left: "50%",
                top: position === "top" || position.includes("top") ? "-3.5rem" : "auto",
                bottom: position === "bottom" ? "-3.5rem" : "auto",
                right: "auto",
                transform: "translateX(-50%)",
                zIndex: 30,
              }}
          >
          <span className="bg-black/70 text-white font-bold px-3 py-1 rounded-md whitespace-nowrap">
            {playerIndex === 0 ? "You" : playerNames[playerIndex] || `Player ${playerIndex}`}{" "}
            {isCurrentPlayer ? "(Playing)" : ""}
          </span>
          </div>

          <div
              className="relative"
              style={{
                height: position.includes("left") || position.includes("right") ? "250px" : "120px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
          >
            {cards.map((card, index) => {
              // For API integration, we need to determine if the card can be played
              const canPlay =
                  isPlayerHand &&
                  isCurrentPlayer &&
                  (card.type === "special" ||
                      card.color === gameState.currentColor ||
                      (gameState.lastCard && card.value === gameState.lastCard.value))

              // For player 0 (user), we need special handling for playable cards
              const transform = baseTransform(index, totalCards)
              const hoverTransform =
                  isPlayerHand && canPlay ? `${baseTransform(index, totalCards)} translateY(-30px)` : transform

              return (
                  <div
                      key={isPlayerHand ? card.id : `${playerIndex}-${index}`}
                      className="absolute transition-all duration-200"
                      style={{
                        transform: isPlayerHand && canPlay ? `${transform} translateY(-10px)` : transform,
                        transformOrigin: transformOrigin,
                        zIndex: index,
                      }}
                      onMouseEnter={
                        isPlayerHand && canPlay
                            ? (e) => {
                              e.currentTarget.style.transform = hoverTransform
                            }
                            : undefined
                      }
                      onMouseLeave={
                        isPlayerHand && canPlay
                            ? (e) => {
                              e.currentTarget.style.transform = `${transform} translateY(-10px)`
                            }
                            : undefined
                      }
                  >
                    {isPlayerHand ? (
                        card.type === "special" ? (
                            <WildCard
                                onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                                disabled={!canPlay}
                                className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                            />
                        ) : (
                            <UnoCard
                                color={card.color}
                                number={card.value}
                                onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                                disabled={!canPlay}
                                className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                            />
                        )
                    ) : (
                        <CardBack
                            isDark={true}
                            className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                            onClick={() => {}}
                        />
                    )}
                  </div>
              )
            })}
          </div>
        </div>
    )
  }

  // Render animations
  const renderAnimations = () => {
    return (
        <AnimatePresence mode="sync">
          {animations.map((anim) => {
            const fromPos = getPositionCoordinates(anim.from)
            const toPos = getPositionCoordinates(anim.to)

            // Determine rotation based on positions
            let fromRotation = 0
            if (anim.from === "left") fromRotation = 90
            if (anim.from === "right") fromRotation = -90

            let toRotation = 0
            if (anim.to === "left") toRotation = 90
            if (anim.to === "right") toRotation = -90

            // Animation variants with improved transitions - properly typed for Framer Motion
            const variants = {
              initial: {
                x: fromPos.x - 40, // Adjust for card width
                y: fromPos.y - 60, // Adjust for card height
                scale: 1,
                rotate: fromRotation,
                zIndex: 100,
                opacity: 1,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              },
              animate: {
                x: toPos.x - 40, // Adjust for card width
                y: toPos.y - 60, // Adjust for card height
                scale: [1, 1.1, 1], // Smoother scale effect
                rotate: toRotation,
                zIndex: 100,
                opacity: 1,
                boxShadow: [
                  "0 4px 8px rgba(0, 0, 0, 0.2)",
                  "0 8px 16px rgba(0, 0, 0, 0.3)",
                  "0 4px 8px rgba(0, 0, 0, 0.2)",
                ],
                transition: {
                  duration: 0.8, // Longer duration for smoother motion
                  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
                  scale: {
                    times: [0, 0.5, 1],
                    duration: 0.8,
                  },
                  boxShadow: {
                    times: [0, 0.5, 1],
                    duration: 0.8,
                  },
                },
              },
              exit: {
                opacity: 0,
                transition: { duration: 0.3 },
              },
            }

            return (
                <motion.div
                    key={anim.id}
                    style={{ width: "80px", height: "120px", position: "fixed" }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    onAnimationComplete={anim.onComplete}
                >
                  {anim.card.type === "special" ? (
                      <WildCard
                          className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                          onClick={() => {}}
                          disabled={false}
                      />
                  ) : (
                      <UnoCard
                          color={anim.card.color}
                          number={anim.card.value}
                          className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                          onClick={() => {}}
                          disabled={false}
                      />
                  )}
                </motion.div>
            )
          })}
        </AnimatePresence>
    )
  }

  return (
      <div className="min-h-screen bg-[#3E8914] relative overflow-hidden" ref={tableRef}>
        {/* Game info */}
        <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded-md z-50">
          <p>
            Lobby ID: {lobbyID} | Player ID: {playerIdentifier}
          </p>
        </div>

        {/* Message display */}
        {message && (
            <div className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-md z-50 max-w-xs">{message}</div>
        )}

        {/* Winner announcement */}
        {winner !== null && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {winner === playerIdentifier ? "You Win!" : `${playerNames[winner] || `Player ${winner}`} Wins!`}
                </h2>
                <button
                    className="px-6 py-3 bg-[#3E8914] text-white rounded-lg text-xl font-bold shadow-lg hover:bg-[#2d6610] transition-colors"
                    onClick={() => window.location.reload()}
                >
                  Play Again
                </button>
              </div>
            </div>
        )}

        {/* Color picker for wild cards */}
        {showColorPicker && <ColorPicker onSelectColor={handleColorSelect} onClose={() => setShowColorPicker(false)} />}

        {/* Game board */}
        <div className="relative w-full h-[calc(100vh-8rem)]">
          {/* Render all player hands */}
          {gameState.players.map((_, index) => renderPlayerHand(index))}

          {/* Center area with draw and discard piles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
            {/* Draw pile */}
            <div className="relative">
              <CardBack
                  isDark={true}
                  onClick={
                    gameState.currentPlayer === playerIdentifier && !isDrawing && !loading ? handleDrawCard : undefined
                  }
                  className={`w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 ${
                      gameState.currentPlayer === playerIdentifier && !isDrawing && !loading
                          ? "cursor-pointer hover:scale-105"
                          : isDrawing || loading
                              ? "opacity-75"
                              : ""
                  }`}
              />
            </div>

            {/* Discard pile - stacked cards */}
            <div className="relative">
              {/* Stack of cards */}
              {(gameState.visibleDiscardPile || [gameState.lastCard]).map((card, index, array) => {
                const isTopCard = index === array.length - 1
                // Calculate offset for each card in the stack
                const offset = index * 3 // pixels
                const rotation = (index - Math.floor(array.length / 2)) * 5 // degrees

                return (
                    <div
                        key={`discard-${index}-${card.id}`}
                        className="absolute transition-all duration-300"
                        style={{
                          transform: `rotate(${rotation}deg) translate(${offset - 10}px, ${offset - 10}px)`,
                          zIndex: index,
                        }}
                    >
                      {card.type === "special" ? (
                          <WildCard
                              className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
                              onClick={() => {}}
                              disabled={false}
                          />
                      ) : (
                          <UnoCard
                              color={card.color}
                              number={card.value}
                              className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 opacity-100"
                              onClick={() => {}}
                              disabled={false}
                          />
                      )}
                    </div>
                )
              })}
            </div>
          </div>

          {/* Say UNO button */}
          {gameState.players[0] && gameState.players[0].length === 1 && !gameState.sayUno && (
              <div className="absolute bottom-4 right-4">
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700"
                    onClick={handleSayUno}
                >
                  Say UNO!
                </button>
              </div>
          )}

          {/* Render all animations */}
          {renderAnimations()}
        </div>
      </div>
  )
}

