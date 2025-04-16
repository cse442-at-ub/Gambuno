"use client"


import { useState, useEffect, useRef} from "react"
import {useParams} from "react-router-dom";
import { UnoCard, WildCard, CardBack, ColorPicker } from "./cards/cards"
import { motion, AnimatePresence } from "framer-motion"
import * as gameAPI from "./../lib/api";

export function GameBoard({ numPlayers = 5 }) {
  const [gameState, setGameState] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingWildCard, setPendingWildCard] = useState(null)
  const [winner, setWinner] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const { gameCode } = useParams(); 
  const [playerNames, setPlayerNames] = useState(
    
      Array(numPlayers)
          .fill("")
          .map((_, i) => `Player ${i + 1}`),
  )
  const [animatingCard, setAnimatingCard] = useState(null)
  const [drawingPlayer, setDrawingPlayer] = useState(null)
  const [animations, setAnimations] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const tableRef = useRef(null)
  const animationIdRef = useRef(0)
  const windowSize = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  // Initialize game
  const initGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/game.php?action=intialize&gameID=045AMH");
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      // Check if there's content to parse
      const text = await response.json();
      if(text.success){
        setIsLoading(true);
        setGameStarted(false);
        setGameState(false);
        console.log("Game Intialized: ", text.gameInfo);
      }
      else{
        console.log("Game Intialization Failed: ", text.error);
      }
      } 
     catch (err) {
      console.error("Failed to initialize game:", err);
      setError("Failed to start the game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (gameState.currentPlayer !== 0 || winner || isDrawing || isLoading) return

    try {
      // Set drawing state to prevent multiple draws
      setIsDrawing(true)
      setIsLoading(true)
      setError(null)

      // Call the API to draw a card
      const updatedGameState = await gameAPI.drawCard(0, gameState)

      // Get the newly drawn card (last card in player's hand)
      const newCard = updatedGameState.players[0][updatedGameState.players[0].length - 1]

      // Add draw animation
      addAnimation("draw", newCard, "drawPile", "player", () => {
        setGameState(updatedGameState)
        setIsDrawing(false)

        // If it's AI's turn after drawing, trigger AI move
        if (updatedGameState.currentPlayer !== 0) {
          setTimeout(() => {
            playAITurn()
          }, 800)
        }
      })
    } catch (err) {
      console.error("Failed to draw card:", err)
      setError("Failed to draw a card. Please try again.")
      setIsDrawing(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle playing a card with animation
  const handlePlayCard = async (card, index) => {
    if (gameState.currentPlayer !== 0 || winner || isDrawing || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Check if the card can be played
      const isPlayable = await gameAPI.checkCardPlayable(card, gameState.lastCard, gameState.currentColor)

      if (!isPlayable) {
        setIsLoading(false)
        return
      }

      // Handle wild cards
      if (card.type === "special") {
        setPendingWildCard({ card, index })
        setShowColorPicker(true)
        setIsLoading(false)
        return
      }

      // First visually remove the card from the hand
      setGameState((prev) => {
        const newState = { ...prev }
        // Create a temporary copy without the card to be played
        // This makes it visually disappear from the hand
        const tempHand = [...newState.players[0]]
        tempHand.splice(index, 1)
        newState.players[0] = tempHand
        return newState
      })

      // Then add play animation
      setTimeout(() => {
        addAnimation("play", card, "player", "discardPile", async () => {
          // Call the API to play the card
          const updatedGameState = await gameAPI.playCard(0, card, index, gameState)
          setGameState(updatedGameState)

          // Check for winner
          if (updatedGameState.players[0].length === 0) {
            setWinner(0)
          } else if (updatedGameState.currentPlayer !== 0) {
            // If it's AI's turn after playing, trigger AI move
            setTimeout(() => {
              playAITurn()
            }, 800)
          }

          setIsLoading(false)
        })
      }, 50) // Small delay to ensure the card is visually removed first
    } catch (err) {
      console.error("Failed to play card:", err)
      setError("Failed to play the card. Please try again.")
      setIsLoading(false)
    }
  }

  // Handle color selection for wild cards
  const handleColorSelect = async (color) => {
    setShowColorPicker(false)

    if (!pendingWildCard || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // First visually remove the card from the hand
      setGameState((prev) => {
        const newState = { ...prev }
        // Create a temporary copy without the card to be played
        // This makes it visually disappear from the hand
        const tempHand = [...newState.players[0]]
        tempHand.splice(pendingWildCard.index, 1)
        newState.players[0] = tempHand
        return newState
      })

      // Then add play animation
      setTimeout(() => {
        addAnimation("play", pendingWildCard.card, "player", "discardPile", async () => {
          // Call the API to play the wild card with selected color
          const updatedGameState = await gameAPI.playWildCard(
              0,
              pendingWildCard.card,
              pendingWildCard.index,
              color,
              gameState,
          )

          setGameState(updatedGameState)
          setPendingWildCard(null)

          // Check for winner
          if (updatedGameState.players[0].length === 0) {
            setWinner(0)
          } else if (updatedGameState.currentPlayer !== 0) {
            // If it's AI's turn after playing, trigger AI move
            setTimeout(() => {
              playAITurn()
            }, 800)
          }

          setIsLoading(false)
        })
      }, 50)
    } catch (err) {
      console.error("Failed to play wild card:", err)
      setError("Failed to play the wild card. Please try again.")
      setPendingWildCard(null)
      setIsLoading(false)
    }
  }

  // AI player turn logic with animations
  const playAITurn = async () => {
    if (!gameState || gameState.currentPlayer === 0 || winner || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      const currentPlayerIndex = gameState.currentPlayer

      // Call the API to get the AI move
      const aiMoveResult = await gameAPI.getAIMove(currentPlayerIndex, gameState)

      // Handle different AI move types
      if (aiMoveResult.moveType === "draw") {
        // AI is drawing a card
        const drawnCard = aiMoveResult.drawnCard

        // Add draw animation for AI
        const playerPosition = getPlayerPosition(currentPlayerIndex).position
        addAnimation("draw", drawnCard, "drawPile", playerPosition, () => {
          setGameState(aiMoveResult.gameState)

          // If AI can play the drawn card, it will be handled in the next AI turn
          if (aiMoveResult.gameState.currentPlayer !== 0) {
            setTimeout(() => {
              playAITurn()
            }, 800)
          }

          setIsLoading(false)
        })
      } else if (aiMoveResult.moveType === "play") {
        // AI is playing a card
        const cardToPlay = aiMoveResult.playedCard
        const playerPosition = getPlayerPosition(currentPlayerIndex).position

        // Add play animation for AI
        addAnimation("play", cardToPlay, playerPosition, "discardPile", () => {
          setGameState(aiMoveResult.gameState)

          // Check for winner
          if (aiMoveResult.gameState.players[currentPlayerIndex].length === 0) {
            setWinner(currentPlayerIndex)
          } else if (aiMoveResult.gameState.currentPlayer !== 0) {
            // If it's still AI's turn, continue AI moves
            setTimeout(() => {
              playAITurn()
            }, 800)
          }

          setIsLoading(false)
        })
      }
    } catch (err) {
      console.error("Failed to process AI turn:", err)
      setError("Failed to process AI turn. Please try again.")
      setIsLoading(false)
    }
  }

  // Say UNO button handler
  const handleSayUno = async () => {
    if (gameState.players[0].length !== 1 || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Call the API to say UNO
      const updatedGameState = await gameAPI.sayUno(0, gameState)

      setGameState(updatedGameState)
    } catch (err) {
      console.error("Failed to say UNO:", err)
      setError("Failed to say UNO. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get player position based on player index and total number of players
  const getPlayerPosition = (playerIndex) => {
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

  // Start a new game
  useEffect(() => {
    if (!gameStarted) {
      initGame()
    }
  }, [gameStarted])

  if (!gameState) {
    return (
        <div className="flex items-center justify-center h-screen bg-[#3E8914]">
          <button
              className="px-6 py-3 bg-black text-white rounded-lg text-xl font-bold shadow-lg hover:bg-gray-800 transition-colors"
              onClick={initGame}
              disabled={isLoading}
          >
            {isLoading ? "Starting Game..." : "Start Game"}
          </button>
          {error && <div className="absolute bottom-10 bg-red-500 text-white p-4 rounded-lg">{error}</div>}
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
            {playerNames[playerIndex]} {isCurrentPlayer ? "(Playing)" : ""}
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
              const canPlay =
                  isCurrentPlayer &&
                  (card.type === "special" ||
                      card.color === gameState.currentColor ||
                      (gameState.lastCard && card.value === gameState.lastCard.value))

              // For player 0 (user), we need special handling for playable cards
              const transform = baseTransform(index, totalCards)
              const hoverTransform =
                  playerIndex === 0 && canPlay ? `${baseTransform(index, totalCards)} translateY(-30px)` : transform

              return (
                  <div
                      key={playerIndex === 0 ? card.id : `${playerIndex}-${index}`}
                      className="absolute transition-all duration-200"
                      style={{
                        transform: playerIndex === 0 && canPlay ? `${transform} translateY(-10px)` : transform,
                        transformOrigin: transformOrigin,
                        zIndex: index,
                      }}
                      onMouseEnter={
                        playerIndex === 0 && canPlay
                            ? (e) => {
                              e.currentTarget.style.transform = hoverTransform
                            }
                            : undefined
                      }
                      onMouseLeave={
                        playerIndex === 0 && canPlay
                            ? (e) => {
                              e.currentTarget.style.transform = `${transform} translateY(-10px)`
                            }
                            : undefined
                      }
                  >
                    {playerIndex === 0 ? (
                        card.type === "special" ? (
                            <WildCard
                                onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                                disabled={!canPlay || isLoading}
                                className="w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40"
                            />
                        ) : (
                            <UnoCard
                                color={card.color}
                                number={card.value}
                                onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                                disabled={!canPlay || isLoading}
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
        {/* Loading overlay */}
        {isLoading && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40 pointer-events-none">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="animate-spin h-8 w-8 border-4 border-[#3E8914] border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-center">Processing...</p>
              </div>
            </div>
        )}

        {/* Error message */}
        {error && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
              {error}
            </div>
        )}

        {/* Winner announcement */}
        {winner !== null && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold mb-4">{winner === 0 ? "You Win!" : `${playerNames[winner]} Wins!`}</h2>
                <button
                    className="px-6 py-3 bg-[#3E8914] text-white rounded-lg text-xl font-bold shadow-lg hover:bg-[#2d6610] transition-colors"
                    onClick={initGame}
                    disabled={isLoading}
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
          {Array.from({ length: numPlayers }).map((_, index) => renderPlayerHand(index))}

          {/* Center area with draw and discard piles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
            {/* Draw pile */}
            <div className="relative">
              <CardBack
                  isDark={true}
                  onClick={gameState.currentPlayer === 0 && !isDrawing && !isLoading ? handleDrawCard : undefined}
                  className={`w-24 h-36 sm:w-28 sm:h-40 md:w-28 md:h-40 lg:w-28 lg:h-40 ${
                      gameState.currentPlayer === 0 && !isDrawing && !isLoading
                          ? "cursor-pointer hover:scale-105"
                          : isDrawing || isLoading
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
          {gameState.players[0].length === 1 && !gameState.sayUno && (
              <div className="absolute bottom-4 right-4">
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700"
                    onClick={handleSayUno}
                    disabled={isLoading}
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

