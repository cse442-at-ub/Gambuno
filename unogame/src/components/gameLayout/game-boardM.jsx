import { useState, useEffect, useRef } from "react"
import { UnoCard, WildCard, CardBack, ColorPicker } from "./cards/cards"
import { createDeck, dealCards, canPlayCard, applyCardEffect } from "../../lib/game-logic"
import { motion, AnimatePresence } from "framer-motion"

export function GameBoard2({ numPlayers = 6 }) {
  const [gameState, setGameState] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingWildCard, setPendingWildCard] = useState(null)
  const [winner, setWinner] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerNames, setPlayerNames] = useState(
    Array(numPlayers)
      .fill("")
      .map((_, i) => `Player ${i + 1} ID`),
  )
  const [animations, setAnimations] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const tableRef = useRef(null)
  const animationIdRef = useRef(0)
  const windowSize = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 390,
    height: typeof window !== "undefined" ? window.innerHeight : 844,
  })

  // Initialize game
  const initGame = () => {
    const deck = createDeck()
    const { hands, deck: newDeck, discardPile } = dealCards(deck, numPlayers)

    setGameState({
      players: hands,
      drawPile: newDeck,
      discardPile,
      currentPlayer: 0,
      direction: 1,
      currentColor: discardPile[0].color,
      lastCard: discardPile[0],
      sayUno: false,
      visibleDiscardPile: [discardPile[0]], // Track visible cards in the discard pile
    })

    setWinner(null)
    setGameStarted(true)
    setAnimations([])
    setIsDrawing(false)
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
    setAnimations((prev) => [...prev, { id, type, card, from, to, onComplete }])

    // Auto-remove animation after it completes
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== id))
      if (onComplete) onComplete()
    }, 600) // Faster animation
  }

  // Handle drawing a card with animation
  const handleDrawCard = () => {
    if (gameState.currentPlayer !== 0 || winner || isDrawing) return

    // Set drawing state to prevent multiple draws
    setIsDrawing(true)

    // Generate a new random card instead of taking from the deck
    const newCard = generateRandomCard()

    setGameState((prev) => {
      const newState = { ...prev }
      // Add the card to the player's hand
      newState.players[0] = [...newState.players[0], newCard]
      return newState
    })

    // Add draw animation
    addAnimation("draw", newCard, "drawPile", "player", () => {
      // Check if the newly drawn card is playable
      const isNewCardPlayable =
        newCard.type === "special" ||
        newCard.color === gameState.currentColor ||
        (gameState.lastCard && newCard.value === gameState.lastCard.value)

      // If not playable, draw another card automatically
      if (!isNewCardPlayable) {
        setTimeout(() => {
          setIsDrawing(false) // Reset drawing state before drawing again
          handleDrawCard()
        }, 300)
      } else {
        // Card is playable, reset drawing state
        setIsDrawing(false)
      }
    })
  }

  // Generate a random card for infinite deck
  const generateRandomCard = () => {
    const colors = ["red", "blue", "green", "yellow"]
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const specialTypes = ["Wild", "Wild4"]

    // 20% chance of getting a special card
    const isSpecial = Math.random() < 0.2

    if (isSpecial) {
      const specialValue = specialTypes[Math.floor(Math.random() * specialTypes.length)]
      return {
        id: `special-${specialValue}-${Date.now()}`,
        color: "wild",
        value: specialValue,
        type: "special",
      }
    } else {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const value = values[Math.floor(Math.random() * values.length)]
      return {
        id: `${color}-${value}-${Date.now()}`,
        color,
        value,
        type: "number",
      }
    }
  }

  // Handle playing a card with animation
  const handlePlayCard = (card, index) => {
    if (gameState.currentPlayer !== 0 || winner || isDrawing) return

    // Check if the card can be played
    if (!canPlayCard(card, gameState.lastCard, gameState.currentColor)) {
      return
    }

    // Handle wild cards
    if (card.type === "special") {
      setPendingWildCard({ card, index })
      setShowColorPicker(true)
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
      addAnimation("play", card, "player", "discardPile", () => {
        playCard(card, index, card.color)
      })
    }, 50) // Small delay to ensure the card is visually removed first
  }

  // Play a card with the selected color (for wild cards)
  const playCard = (card, index, selectedColor) => {
    setGameState((prev) => {
      const newState = { ...prev }

      // Remove the card from the player's hand
      const playerHand = [...newState.players[newState.currentPlayer]]
      playerHand.splice(index, 1)
      newState.players[newState.currentPlayer] = playerHand

      // Add the card to the discard pile
      newState.discardPile = [...newState.discardPile, card]
      newState.lastCard = card

      // Update the visible discard pile (keep last 5 cards)
      newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), card].slice(-5)

      // Update the current color
      newState.currentColor = selectedColor || card.color

      // Apply card effects
      const { nextPlayer, direction, drawCount } = applyCardEffect(newState, card)
      newState.currentPlayer = nextPlayer
      newState.direction = direction

      // Handle draw cards
      if (drawCount > 0) {
        for (let i = 0; i < drawCount; i++) {
          if (newState.drawPile.length === 0) {
            // Reshuffle if needed
            const topCard = newState.discardPile.pop()
            newState.drawPile = [...newState.discardPile].sort(() => Math.random() - 0.5)
            newState.discardPile = [topCard]
          }

          const drawnCard = newState.drawPile.pop()
          newState.players[nextPlayer] = [...newState.players[nextPlayer], drawnCard]
        }
      }

      // Check for winner
      if (playerHand.length === 0) {
        setWinner(newState.currentPlayer)
        return newState
      }

      // AI players will play automatically
      setTimeout(() => {
        playAITurn()
      }, 1000)

      return newState
    })
  }

  // Handle color selection for wild cards
  const handleColorSelect = (color) => {
    setShowColorPicker(false)
    if (pendingWildCard) {
      // First visually remove the card from the hand
      setGameState((prev) => {
        const newState = { ...prev }
        // Create a temporary copy without the card to be played
        const tempHand = [...newState.players[0]]
        tempHand.splice(pendingWildCard.index, 1)
        newState.players[0] = tempHand
        return newState
      })

      // Then add play animation
      setTimeout(() => {
        addAnimation("play", pendingWildCard.card, "player", "discardPile", () => {
          playCard(pendingWildCard.card, pendingWildCard.index, color)
          setPendingWildCard(null)
        })
      }, 50)
    }
  }

  // AI player turn logic with animations
  const playAITurn = () => {
    if (!gameState || gameState.currentPlayer === 0 || winner) return

    const currentPlayerIndex = gameState.currentPlayer
    const playerHand = gameState.players[currentPlayerIndex]

    // Find playable cards
    const playableCards = playerHand.filter(
      (card) =>
        card.type === "special" || card.color === gameState.currentColor || card.value === gameState.lastCard.value,
    )

    if (playableCards.length > 0) {
      // Choose a card to play (simple AI strategy)
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)]
      const cardIndex = playerHand.findIndex((c) => c.id === cardToPlay.id)

      // First visually remove the card from the AI hand
      setGameState((prev) => {
        const newState = { ...prev }
        const tempHand = [...newState.players[currentPlayerIndex]]
        tempHand.splice(cardIndex, 1)
        newState.players[currentPlayerIndex] = tempHand
        return newState
      })

      // Then add play animation for AI
      setTimeout(() => {
        const playerPosition = getPlayerPosition(currentPlayerIndex).position
        addAnimation("play", cardToPlay, playerPosition, "discardPile", () => {
          setGameState((prev) => {
            const newState = { ...prev }

            // Remove the card from the player's hand
            const newPlayerHand = [...playerHand]
            newPlayerHand.splice(cardIndex, 1)
            newState.players[currentPlayerIndex] = newPlayerHand

            // Add the card to the discard pile
            newState.discardPile = [...newState.discardPile, cardToPlay]
            newState.lastCard = cardToPlay

            // Update the visible discard pile (keep last 5 cards)
            newState.visibleDiscardPile = [...(newState.visibleDiscardPile || []), cardToPlay].slice(-5)

            // Handle wild cards
            if (cardToPlay.type === "special") {
              // AI chooses a color (simple strategy: choose the most common color in hand)
              const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 }
              newPlayerHand.forEach((c) => {
                if (c.color !== "wild") {
                  colorCounts[c.color]++
                }
              })

              let maxColor = "red"
              let maxCount = 0
              Object.entries(colorCounts).forEach(([color, count]) => {
                if (count > maxCount) {
                  maxColor = color
                  maxCount = count
                }
              })

              newState.currentColor = maxColor
            } else {
              newState.currentColor = cardToPlay.color
            }

            // Apply card effects
            const { nextPlayer, direction, drawCount } = applyCardEffect(newState, cardToPlay)
            newState.currentPlayer = nextPlayer
            newState.direction = direction

            // Handle draw cards
            if (drawCount > 0) {
              for (let i = 0; i < drawCount; i++) {
                if (newState.drawPile.length === 0) {
                  // Reshuffle if needed
                  const topCard = newState.discardPile.pop()
                  newState.drawPile = [...newState.discardPile].sort(() => Math.random() - 0.5)
                  newState.discardPile = [topCard]
                }

                const drawnCard = newState.drawPile.pop()

                // Add draw animation for each card
                setTimeout(() => {
                  addAnimation("draw", drawnCard, "drawPile", getPlayerPosition(nextPlayer).position, () => {
                    // This will be called after each animation completes
                  })
                }, i * 300)

                // Add the card to the player's hand immediately (the animation is just visual)
                newState.players[nextPlayer].push(drawnCard)
              }

              // Continue AI turns after all animations
              setTimeout(
                () => {
                  if (newState.currentPlayer !== 0) {
                    playAITurn()
                  }
                },
                drawCount * 300 + 1000,
              )

              return newState
            }

            // Check for winner
            if (newPlayerHand.length === 0) {
              setWinner(currentPlayerIndex)
              return newState
            }

            // Continue AI turns if the next player is also AI
            if (newState.currentPlayer !== 0) {
              setTimeout(() => {
                playAITurn()
              }, 1000)
            }

            return newState
          })
        })
      }, 50)
    } else {
      // AI needs to draw a card
      setTimeout(() => {
        setGameState((prev) => {
          const newState = { ...prev }

          // Generate a random card instead of taking from the deck
          const drawnCard = generateRandomCard()

          // Add the card to the player's hand immediately
          newState.players[currentPlayerIndex].push(drawnCard)

          // Add draw animation for AI
          const playerPosition = getPlayerPosition(currentPlayerIndex).position
          addAnimation("draw", drawnCard, "drawPile", playerPosition, () => {
            // Check if the drawn card can be played
            if (canPlayCard(drawnCard, newState.lastCard, newState.currentColor)) {
              // Recursively call AI turn to play the card
              setTimeout(() => {
                playAITurn()
              }, 800)
            } else {
              // Draw another card since this one can't be played
              setTimeout(() => {
                playAITurn()
              }, 800)
            }
          })

          return newState
        })
      }, 800)
    }
  }

  // Say UNO button handler
  const handleSayUno = () => {
    if (gameState.players[0].length === 1) {
      setGameState((prev) => ({
        ...prev,
        sayUno: true,
      }))
    }
  }

  // Get player position based on player index and total number of players
  // This follows the Figma design layout
  const getPlayerPosition = (playerIndex) => {
    // Player 0 is always at the bottom (You)
    if (playerIndex === 0) return { position: "bottom", rotation: 0 }

    // Based on the Figma design with 6 players
    if (numPlayers === 6) {
      if (playerIndex === 1) return { position: "bottom-left", rotation: 0 } // Player 2 ID
      if (playerIndex === 2) return { position: "left", rotation: 90 } // Player 3 ID
      if (playerIndex === 3) return { position: "top", rotation: 0 } // Player 4 ID
      if (playerIndex === 4) return { position: "right", rotation: -90 } // Player 5 ID
      if (playerIndex === 5) return { position: "bottom-right", rotation: 0 } // Player 6 ID
    } else if (numPlayers === 4) {
      if (playerIndex === 1) return { position: "left", rotation: 90 }
      if (playerIndex === 2) return { position: "top", rotation: 0 }
      if (playerIndex === 3) return { position: "right", rotation: -90 }
    } else if (numPlayers === 3) {
      if (playerIndex === 1) return { position: "left", rotation: 90 }
      if (playerIndex === 2) return { position: "right", rotation: -90 }
    } else if (numPlayers === 2) {
      if (playerIndex === 1) return { position: "top", rotation: 0 }
    }

    // Default fallback
    return { position: "top", rotation: 0 }
  }

  // Get position coordinates for animations
  const getPositionCoordinates = (position) => {
    // Use window dimensions for responsive positioning
    const centerX = windowSize.current.width / 2
    const centerY = windowSize.current.height / 2

    switch (position) {
      case "drawPile":
        return { x: centerX - 40, y: centerY }
      case "discardPile":
        return { x: centerX + 40, y: centerY }
      case "player":
      case "bottom":
        return { x: centerX, y: centerY + 300 }
      case "bottom-left":
        return { x: centerX - 200, y: centerY + 200 }
      case "bottom-right":
        return { x: centerX + 200, y: centerY + 200 }
      case "top":
        return { x: centerX, y: centerY - 200 }
      case "left":
        return { x: centerX - 200, y: centerY }
      case "right":
        return { x: centerX + 200, y: centerY }
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
        >
          Start Game
        </button>
      </div>
    )
  }

  // Render player's hand with card stacking based on Figma design
  const renderPlayerHand = (playerIndex) => {
    if (!gameState.players[playerIndex]) return null

    const { position } = getPlayerPosition(playerIndex)
    const isCurrentPlayer = gameState.currentPlayer === playerIndex
    const cards = gameState.players[playerIndex]
    const totalCards = cards.length

    // Position styles based on the Figma design
    let containerStyle = {}
    let cardStackStyle = {}
    let cardSize = "w-14 h-20" // Default mobile card size

    // Determine position and styling based on player position
    switch (position) {
      case "bottom": // Your cards (player)
        containerStyle = {
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }
        cardStackStyle = {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "300px",
          gap: "2px",
        }
        cardSize = "w-14 h-20" // Slightly larger for player's hand
        break
      case "bottom-left": // Player 2 ID
        containerStyle = {
          bottom: "100px",
          left: "80px",
          transform: "translateX(-50%)",
        }
        break
      case "bottom-right": // Player 6 ID
        containerStyle = {
          bottom: "100px",
          right: "30px",
          transform: "translateX(50%)",
        }
        break
      case "left": // Player 3 ID
        containerStyle = {
          left: "30px",
          top: "50%",
          transform: "translateY(-50%)",
        }
        cardStackStyle = {
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }
        break
      case "right": // Player 5 ID
        containerStyle = {
          right: "30px",
          top: "50%",
          transform: "translateY(-50%)",
        }
        cardStackStyle = {
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }
        break
      case "top": // Player 4 ID
        containerStyle = {
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
        }
        cardStackStyle = {
          display: "flex",
          gap: "2px",
        }
        break
      default:
        containerStyle = {
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }
    }

    // Player name tag styling
    const nameTagStyle = {
      position: "absolute",
      backgroundColor: "#d9d9d9",
      color: "black",
      padding: "8px 16px",
      borderRadius: "20px",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      zIndex: 20,
    }

    // Position the name tag based on player position
    let nameTagPositionStyle = {}
    switch (position) {
      case "bottom":
        nameTagPositionStyle = {
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
        }
        break
      case "bottom-left":
        nameTagPositionStyle = {
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
        }
        break
      case "bottom-right":
        nameTagPositionStyle = {
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
        }
        break
      case "left":
        nameTagPositionStyle = {
          left: "-20px",
          top: "50%",
          transform: "translateY(-50%) translateX(-100%)",
        }
        break
      case "right":
        nameTagPositionStyle = {
          right: "-20px",
          top: "50%",
          transform: "translateY(-50%) translateX(100%)",
        }
        break
      case "top":
        nameTagPositionStyle = {
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
        }
        break
    }

    // Render player's cards
    return (
      <div className="absolute" style={containerStyle}>
        {/* Player name tag */}
        <div 
// @ts-ignore
        style={{ ...nameTagStyle, ...nameTagPositionStyle }}>
          {playerIndex === 0 ? "You" : `Player ${playerIndex + 1} ID`}
        </div>

        {/* Card stack */}
        <div style={cardStackStyle}>
          {playerIndex === 0
            ? // Player's cards - show actual cards in a fan layout
              cards.map((card, index) => {
                const canPlay =
                  isCurrentPlayer &&
                  (card.type === "special" ||
                    card.color === gameState.currentColor ||
                    (gameState.lastCard && card.value === gameState.lastCard.value))

                return (
                  <div
                    key={card.id}
                    className={`transition-all duration-200 ${index > 0 ? "-ml-8" : ""}`}
                    style={{
                      zIndex: index,
                      transform: canPlay ? "translateY(-10px)" : "none",
                    }}
                  >
                    {card.type === "special" ? (
                      <WildCard
                        onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                        disabled={!canPlay}
                        className={cardSize}
                      />
                    ) : (
                      <UnoCard
                        color={card.color}
                        number={card.value}
                        onClick={canPlay ? () => handlePlayCard(card, index) : undefined}
                        disabled={!canPlay}
                        className={cardSize}
                      />
                    )}
                  </div>
                )
              })
            : // AI players - show card backs in a stack
              Array.from({ length: Math.min(7, totalCards) }).map((_, index) => (
                <div
                  key={`${playerIndex}-${index}`}
                  className={`${position === "left" || position === "right" ? "mb-[-12px]" : "ml-[-12px]"}`}
                  style={{ zIndex: index }}
                >
                  <CardBack isDark={true} className={cardSize} onClick={undefined} />
                </div>
              ))}
        </div>
      </div>
    )
  }

  // Render animations
  const renderAnimations = () => {
    return (
      <AnimatePresence>
        {animations.map((anim) => {
          const fromPos = getPositionCoordinates(anim.from)
          const toPos = getPositionCoordinates(anim.to)

          // Animation variants
          const variants = {
            initial: {
              position: "fixed",
              left: fromPos.x - 20,
              top: fromPos.y - 30,
              scale: 1,
              rotate: anim.from === "left" ? 90 : anim.from === "right" ? -90 : 0,
              zIndex: 100,
              opacity: 1,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
            animate: {
              left: toPos.x - 20,
              top: toPos.y - 30,
              scale: [1, 1.2, 1],
              rotate: anim.to === "left" ? 90 : anim.to === "right" ? -90 : 0,
              zIndex: 100,
              opacity: 1,
              boxShadow: [
                "0 4px 8px rgba(0, 0, 0, 0.2)",
                "0 8px 16px rgba(0, 0, 0, 0.3)",
                "0 4px 8px rgba(0, 0, 0, 0.2)",
              ],
              transition: {
                duration: 0.5,
                ease: [0.19, 1.0, 0.22, 1.0],
                scale: {
                  times: [0, 0.5, 1],
                  duration: 0.5,
                },
                boxShadow: {
                  times: [0, 0.5, 1],
                  duration: 0.5,
                },
              },
            },
            exit: { opacity: 0 },
          }

          return (
            <motion.div
              key={anim.id}
              className="fixed"
              style={{ width: "40px", height: "60px" }}
              initial="initial"
              animate="animate"
              exit="exit"
              // @ts-ignore
              variants={variants}
              onAnimationComplete={anim.onComplete}
            >
              {anim.card.type === "special" ? (
                <WildCard className="w-14 h-20" onClick={undefined} disabled={undefined} />
              ) : (
                <UnoCard color={anim.card.color} number={anim.card.value} className="w-14 h-20" onClick={undefined} disabled={undefined} />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-[#3E8914] relative overflow-hidden" ref={tableRef}>
      {/* Quit button - positioned as in Figma */}
      <button
        className="absolute top-6 left-6 bg-[#F42C04] text-white font-bold py-3 px-8 rounded-full text-xl"
        onClick={() => window.location.reload()}
      >
        QUIT
      </button>

      {/* Winner announcement */}
      {winner !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-2xl text-center max-w-[90%] w-auto">
            <h2 className="text-xl sm:text-3xl font-bold mb-4">
              {winner === 0 ? "You Win!" : `${playerNames[winner]} Wins!`}
            </h2>
            <button
              className="px-4 py-2 sm:px-6 sm:py-3 bg-[#3E8914] text-white rounded-lg text-lg sm:text-xl font-bold shadow-lg hover:bg-[#2d6610] transition-colors"
              onClick={initGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Color picker for wild cards */}
      {showColorPicker && <ColorPicker onSelectColor={handleColorSelect} onClose={() => setShowColorPicker(false)} />}

      {/* Game board */}
      <div className="relative w-full h-screen">
        {/* Render all player hands */}
        {Array.from({ length: numPlayers }).map((_, index) => renderPlayerHand(index))}

        {/* Center area with draw and discard piles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
          {/* Draw pile */}
          <div className="relative">
            <CardBack
              isDark={true}
              onClick={gameState.currentPlayer === 0 && !isDrawing ? handleDrawCard : undefined}
              className={`w-14 h-20 ${
                gameState.currentPlayer === 0 && !isDrawing
                  ? "cursor-pointer hover:scale-105"
                  : isDrawing
                    ? "opacity-75"
                    : ""
              }`}
            />
          </div>

          {/* Discard pile - top card */}
          <div className="relative">
            {gameState.lastCard && (
              <div>
                {gameState.lastCard.type === "special" ? (
                  <WildCard className="w-14 h-20 opacity-100" onClick={undefined} disabled={undefined} />
                ) : (
                  <UnoCard
                      color={gameState.lastCard.color}
                      number={gameState.lastCard.value}
                      className="w-14 h-20 opacity-100" onClick={undefined} disabled={undefined}                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* UNO button */}
        <div className="absolute bottom-20 right-20">
          <button className="bg-[#d9d9d9] text-black font-bold py-3 px-8 rounded-full text-xl" onClick={handleSayUno}>
            UNO
          </button>
        </div>

        {/* Render all animations */}
        {renderAnimations()}
      </div>
    </div>
  )
}

// =============== MAIN PAGE COMPONENT ===============

export default function Home() {
  const [numPlayers, setNumPlayers] = useState(6) // Default to 6 players as in Figma
  const [gameStarted, setGameStarted] = useState(false)

  const handleStartGame = () => {
    setGameStarted(true)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#3E8914] flex flex-col items-center justify-center p-4">
        <div className="bg-black p-4 sm:p-8 rounded-xl shadow-2xl max-w-md w-full">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-white">UNO Card Game</h1>

          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Number of Players:</label>
            <div className="flex justify-between">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold ${
                    numPlayers === num ? "bg-white text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setNumPlayers(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full py-2 sm:py-3 bg-white text-black rounded-lg text-lg sm:text-xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return <GameBoard2 numPlayers={numPlayers} />
}