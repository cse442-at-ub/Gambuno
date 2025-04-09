"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UnoCard, WildCard, CardBack, CardBackODeck } from "./cards/cards"
import { getGameState, playCard, drawCard, initializeGame } from "./../lib/api"
import { AlertCircle, CheckCircle2, X, Users, Trophy, DollarSign } from "lucide-react"

export default function UnoGameBoard({ gameId, playerId }) {
  const [gameState, setGameState] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [error, setError] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [gameMessage, setGameMessage] = useState("")
  const [selectedColor, setSelectedColor] = useState(null)
  const navigate = useNavigate()

  // Fetch game state at regular intervals
  useEffect(() => {
    fetchGameState()

    const intervalId = setInterval(() => {
      fetchGameState()
    }, 1000) // Poll every 3 seconds

    return () => clearInterval(intervalId)
  }, [])

  const fetchGameState = async () => {
    try {
      setIsLoading(true)
      const state = await getGameState(gameId, playerId)

      if (state.success) {
        setGameState(state)
        if (String(state.gameStatus) === "finished") {
          navigate("/")
        }

        // Find the current player's data to get their hand
        const currentPlayerData = state.players.find((player) => player.playerID === playerId)
        if (currentPlayerData && currentPlayerData.cardList) {
          setPlayerHand(currentPlayerData.cardList.split(","))
        }
      } else {
        setError(state.message || "Failed to load game state")
      }
    } catch (error) {
      console.error("Error fetching game state:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardPlay = async (card) => {
    const cleaned = card.replace(/[^a-zA-Z0-9_]/g, "")

    // If card is wild, show color picker
    //if (card.startsWith("wild_")) {
    // setSelectedCard(card)
    //setShowColorPicker(true)
    //return
    //}
    console.log("Playing card:", cleaned)

    try {
      console.log("Playing card in console:", cleaned)
      setIsLoading(true)
      const result = await playCard(playerId, gameId, String(cleaned))
      console.log("Result:", result)
      if (result.success) {
        setGameMessage(result.message)
        await fetchGameState() // Refresh game state after playing
      } else {
        setError(result.message || "Failed to play card")
      }
    } catch (error) {
      console.error("Error playing card:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorSelect = async (color) => {
    if (!selectedCard) return

    setSelectedColor(color)
    // Format the wild card with the selected color
    const playableCard = selectedCard
    setShowColorPicker(false)

    try {
      setIsLoading(true)
      const result = await playCard(playerId, gameId, playableCard)

      if (result.success) {
        setGameMessage(result.message)
        await fetchGameState() // Refresh game state after playing
      } else {
        setError(result.message || "Failed to play wild card")
      }
    } catch (error) {
      console.error("Error playing wild card:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
      setSelectedCard(null)
    }
  }

  const handleDrawCard = async () => {
    try {
      setIsLoading(true)
      const result = await drawCard(gameId, playerId)

      if (result.success) {
        setGameMessage(`Drew a card: ${result.new_card}`)
        await fetchGameState() // Refresh game state after drawing
      } else {
        setError(result.message || "Failed to draw card")
      }
    } catch (error) {
      console.error("Error drawing card:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
    }
  }

  const startGame = async () => {
    try {
      setIsLoading(true)
      const result = await initializeGame(gameId, playerId)

      if (result.success) {
        setGameMessage("Game started!")
        await fetchGameState() // Refresh game state after starting
      } else {
        setError(result.message || "Failed to start game")
      }
    } catch (error) {
      console.error("Error starting game:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
    }
  }

  // Render card component based on card string (color_value)
  const renderCard = (cardC, index, playable = false) => {
    const card = cardC.replace(/[^a-zA-Z0-9_]/g, "")
    if (!card) return null

    const [color, number] = card.split("_")
    if (color === "wild") {
      return (
        <WildCard
          key={index}
          className="w-16 h-24 sm:w-20 sm:h-28"
          onClick={playable ? () => handleCardPlay(card) : undefined}
          disabled={!playable}
        />
      )
    } else {
      return (
        <UnoCard
          key={index}
          color={color}
          number={number}
          className="w-16 h-24 sm:w-20 sm:h-28"
          onClick={playable ? () => handleCardPlay(card) : undefined}
          disabled={!playable}
        />
      )
    }
  }

  const isPlayerTurn = gameState?.currentPlayer === playerId
  const currentPlayerData = gameState?.players?.find((player) => player.playerID === playerId)
  const currentPlayerName = currentPlayerData?.playerName || playerId

  // Get the current player's position in the array
  const getPlayerPosition = () => {
    if (!gameState?.players) return -1
    return gameState.players.findIndex((player) => player.playerID === playerId)
  }

  // Arrange other players in a circular layout
  const renderOtherPlayers = () => {
    if (!gameState?.players) return null

    const otherPlayers = gameState.players.filter((player) => player.playerID !== playerId)
    const totalPlayers = otherPlayers.length

    if (totalPlayers === 0) return null

    return (
      <div className="relative w-full h-full">
        {otherPlayers.map((player, index) => {
          // Calculate position based on total players and current index
          let positionClass = ""

          if (totalPlayers <= 2) {
            // For 3 players total (2 opponents)
            positionClass = index === 0 ? "left-0" : "right-0"
          } else if (totalPlayers === 3) {
            // For 4 players total (3 opponents)
            if (index === 0) positionClass = "left-0"
            else if (index === 1) positionClass = "top-0 left-1/2 -translate-x-1/2"
            else positionClass = "right-0"
          } else if (totalPlayers === 4) {
            // For 5 players total (4 opponents)
            if (index === 0) positionClass = "left-0 top-1/4"
            else if (index === 1) positionClass = "left-1/4 top-0"
            else if (index === 2) positionClass = "right-1/4 top-0"
            else positionClass = "right-0 top-1/4"
          } else {
            // For 6 players total (5 opponents)
            if (index === 0) positionClass = "left-0 top-1/3"
            else if (index === 1) positionClass = "left-1/5 top-0"
            else if (index === 2) positionClass = "top-0 left-1/2 -translate-x-1/2"
            else if (index === 3) positionClass = "right-1/5 top-0"
            else positionClass = "right-0 top-1/3"
          }

          return (
            <div key={player.playerID} className={`absolute ${positionClass} transform p-2`}>
              <div
                className={`flex flex-col items-center p-2 sm:p-3 rounded-lg ${
                  gameState.currentPlayer === player.playerID
                    ? "bg-yellow-100 ring-2 ring-yellow-400"
                    : "bg-gray-800 bg-opacity-70"
                }`}
              >
                <div
                  className={`font-bold mb-1 text-xs sm:text-sm ${
                    gameState.currentPlayer === player.playerID ? "text-yellow-800" : "text-white"
                  }`}
                >
                  {player.playerName || `P${index + 1}`}
                </div>
                <div className="flex">
                  {Array(Math.min(player.cardCount || 0, 5))
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="transform -ml-4 sm:-ml-6 first:ml-0" style={{ zIndex: 10 - i }}>
                        <CardBackODeck
                          className="w-8 h-12 sm:w-10 sm:h-14"
                          isDark={gameState.currentPlayer !== player.playerID}
                          onClick={undefined}
                        />
                      </div>
                    ))}
                  {player.cardCount > 5 && (
                    <div className="ml-1 flex items-center justify-center text-white text-xs">
                      +{player.cardCount - 5}
                    </div>
                  )}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    gameState.currentPlayer === player.playerID ? "text-yellow-800" : "text-white"
                  }`}
                >
                  {player.cardCount || 0}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading && !gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-emerald-900 to-black">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#3e8914] p-2 sm:p-4 overflow-hidden">
      {/* Game header with info */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-white">
          <h2 className="text-base sm:text-lg font-bold">UNO</h2>
          <p className="text-xs sm:text-sm">ID: {gameId}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-full flex items-center">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">{gameState?.players?.length || 0}</span>
          </div>
          {gameState?.bettingAmount > 0 && (
            <div className="bg-black flex flex-col bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{gameState.bettingAmount}</span>
              </div>

              <div className="flex items-center">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded shadow-lg flex items-center max-w-[90%] sm:max-w-md">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{error}</span>
          <button className="ml-2 sm:ml-4 flex-shrink-0" onClick={() => setError("")}>
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {gameMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded shadow-lg flex items-center max-w-[90%] sm:max-w-md">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{gameMessage}</span>
          <button className="ml-2 sm:ml-4 flex-shrink-0" onClick={() => setGameMessage("")}>
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Waiting room */}
      {gameState?.gameStatus === "waiting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-4 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Waiting for players...</h2>
            <p className="mb-1 sm:mb-2 text-sm sm:text-base">
              Game Code: <span className="font-mono font-bold">{gameId}</span>
            </p>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">Players: {gameState?.players?.length || 0}</p>

            <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              {gameState?.players?.map((player, index) => (
                <div key={player.playerID} className="bg-gray-100 p-2 rounded truncate">
                  {player.playerName || `Player ${index + 1}`}
                  {player.playerID === gameState.host && (
                    <span className="ml-1 text-xs bg-yellow-200 px-1 rounded">Host</span>
                  )}
                </div>
              ))}
            </div>

            {gameState.host === playerId && (
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-colors text-sm sm:text-base"
                onClick={startGame}
              >
                Start Game
              </button>
            )}
          </div>
        </div>
      )}

      {/* Game board */}
      <div className="flex-1 relative">
        {/* Other players positioned around the board */}
        {renderOtherPlayers()}

        {/* Center play area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex items-center justify-center">
          <div className="flex flex-row items-center space-x-4 sm:space-x-8 bg-black bg-opacity-30 p-3 sm:p-6 rounded-xl">
            {/* Draw pile */}
            <div className="text-center">
              <CardBack
                className="w-16 h-24 sm:w-24 sm:h-36 mb-2 transition-transform hover:scale-105"
                isDark={true}
                onClick={isPlayerTurn ? handleDrawCard : undefined}
              />
              <p className="text-white text-xs sm:text-sm">Draw</p>
            </div>

            {/* Current card */}
            <div className="text-center">
              {gameState?.currentCard ? (
                <div className="relative">
                  {renderCard(gameState.currentCard)}
                  {selectedColor && gameState.currentCard.startsWith("wild_") && (
                    <div
                      className="absolute inset-0 rounded-lg opacity-50"
                      style={{ backgroundColor: selectedColor }}
                    />
                  )}
                </div>
              ) : (
                <div className="w-16 h-24 sm:w-24 sm:h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-white/50 text-xs sm:text-sm">No Card</span>
                </div>
              )}
              <p className="text-white text-xs sm:text-sm mt-2">Current</p>
            </div>
          </div>
        </div>

        {/* Game status */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center">
          <div
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
              isPlayerTurn ? "bg-yellow-400 text-yellow-900" : "bg-white/10 text-white"
            }`}
          >
            {isPlayerTurn
              ? "Your Turn!"
              : `Waiting for ${gameState?.players.find((p) => p.playerID === gameState?.currentPlayer)?.playerName || "opponent"}'s turn`}
          </div>
        </div>
      </div>

      {/* Player's hand */}
      <div className="mt-auto pt-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg font-bold">Your Hand ({currentPlayerName})</h3>
          <div className="text-white text-sm">{playerHand.length} cards</div>
        </div>

        <div className="flex justify-center overflow-x-auto pb-4 px-4">
          <div className="flex">
            {playerHand.map((card, index) => (
              <div
                key={index}
                className={`transform transition-all duration-200 -ml-8 first:ml-0 hover:translate-y--16 ${
                  isPlayerTurn ? "hover:-translate-y-8" : ""
                }`}
                style={{ zIndex: index + 1 }}
              >
                {renderCard(card, index, isPlayerTurn)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color picker dialog */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Choose a color</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 h-16 sm:h-24 rounded-lg transition-colors"
                onClick={() => handleColorSelect("red")}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 h-16 sm:h-24 rounded-lg transition-colors"
                onClick={() => handleColorSelect("blue")}
              />
              <button
                className="bg-yellow-500 hover:bg-yellow-600 h-16 sm:h-24 rounded-lg transition-colors"
                onClick={() => handleColorSelect("yellow")}
              />
              <button
                className="bg-green-500 hover:bg-green-600 h-16 sm:h-24 rounded-lg transition-colors"
                onClick={() => handleColorSelect("green")}
              />
            </div>
            <button
              className="mt-3 sm:mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors text-sm sm:text-base"
              onClick={() => {
                setShowColorPicker(false)
                setSelectedCard(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}