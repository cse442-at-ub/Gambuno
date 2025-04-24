// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import {
//   UnoCard,
//   WildCard,
//   CardBack,
//   SkipCard,
//   ReverseCard,
//   PlusFiveCard,
//   ColoredWildCard,
//   ColoredPlusFiveCard,
// } from "./cards/cardsM"
// import { getGameState, playCard, drawCard, initializeGame } from "../lib/api"
// import { AlertCircle, CheckCircle2, X, Users, Trophy, DollarSign } from "lucide-react"

// // Wild card color mapping
// const WILD_COLOR_MAP = {
//   wild_0: "red",
//   wild_1: "blue",
//   wild_2: "green",
//   wild_3: "yellow",
//   wild_5: "red",
//   wild_6: "blue",
//   wild_7: "green",
//   wild_8: "yellow",
// }

// export default function UnoGameBoardMobile() {
//   const { gameID, playerID } = useParams()
//   const navigate = useNavigate()

//   // Game state
//   const [gameState, setGameState] = useState(null)
//   const [playerHand, setPlayerHand] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [debugInfo, setDebugInfo] = useState(null) // For debugging

//   // UI state
//   const [error, setError] = useState("")
//   const [gameMessage, setGameMessage] = useState("")
//   const [showColorPicker, setShowColorPicker] = useState(false)
//   const [selectedCard, setSelectedCard] = useState(null)
//   const [selectedColor, setSelectedColor] = useState(null)
//   const [expandedHand, setExpandedHand] = useState(false)

//   // Derived state
//   const isPlayerTurn = gameState?.currentPlayer === playerID
//   const currentPlayerData = gameState?.players?.find((player) => player.playerID === playerID)
//   const currentPlayerName = currentPlayerData?.playerName || playerID
//   const isColoredWildCard = ["wild_0", "wild_1", "wild_2", "wild_3"].includes(gameState?.currentCard)
//   const isColoredWild5 = ["wild_5", "wild_6", "wild_7", "wild_8"].includes(gameState?.currentCard)
//   const effectiveColor = WILD_COLOR_MAP[gameState?.currentCard]

//   //End game state
//   const [showWinner, setShowWinner] = useState(false)
//   const [winnerInfo, setWinnerInfo] = useState({ winner: "Unknown", bettingRemain: 0 })

//   // Fetch game state at regular intervals
//   useEffect(() => {
//     fetchGameState()

//     const intervalId = setInterval(() => {
//       fetchGameState()
//     }, 1000)

//     return () => clearInterval(intervalId)
//   }, [])

//   const fetchGameState = async () => {
//     try {
//       setIsLoading(true)
//       const state = await getGameState(gameID, playerID)

//       if (state.success) {
//         setGameState(state)
//         // Save debug info
//         setDebugInfo({
//           playerCount: state.players?.length || 0,
//           playerPosition: state.players?.findIndex((p) => p.playerID === playerID) || -1,
//           players: state.players || [],
//         })

//         // Redirect if game is finished
//         if (String(state.gameStatus) === "finished") {
//           if (String(state.gameStatus) === "finished" && !showWinner) {
//             handleGameEnd()
//           }
//         }

//         // Update player hand
//         const currentPlayerData = state.players.find((player) => player.playerID === playerID)
//         if (currentPlayerData?.cardList) {
//           setPlayerHand(currentPlayerData.cardList.split(","))
//         }
//       } else {
//         setError(state.message || "Failed to load game state")
//       }
//     } catch (error) {
//       console.error("Error fetching game state:", error)
//       setError("Error connecting to the game server")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGameEnd = async () => {
//     try {
//       const playerRes = await fetch(
//         `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerList.php?action=getPlayerList&gameID=${gameID}`,
//       )
//       const playerData = await playerRes.json()
//       const players = typeof playerData.players === "string" ? JSON.parse(playerData.players) : playerData.players

//       let winnerName = "Unknown"
//       let winnerID = ""
//       const betAmount = playerData.betAmount || 0
//       const totalPlayer = players.length
//       const moneyToSet = (betAmount * totalPlayer).toFixed(2)

//       for (const player of players) {
//         const cardRes = await fetch(
//           `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerCardList.php?action=getPlayerCardList&gameID=${gameID}&playerID=${player.playerID}`,
//         )
//         const cardData = await cardRes.json()
//         const cardList = cardData.cardList ? cardData.cardList.split(",") : []

//         if (cardList.length === 0) {
//           winnerName = player.playerName || player.playerID
//           winnerID = player.playerID
//           break
//         }
//       }

//       if (winnerID) {
//         await fetch(
//           `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/setMoney.php?action=setMoney&playerID=${winnerID}&money=${moneyToSet}`,
//         )
//       }
//     } catch (err) {
//       setError("Failed to fetch winner info")
//     }
//   }

//   const handleCardPlay = async (card) => {
//     const cleanedCard = card.replace(/[^a-zA-Z0-9_]/g, "")

//     // Handle wild cards
//     if (cleanedCard.startsWith("wild_")) {
//       setSelectedCard(cleanedCard)
//       setShowColorPicker(true)
//       return
//     }

//     try {
//       setIsLoading(true)
//       const result = await playCard(playerID, gameID, String(cleanedCard))

//       if (result.success) {
//         setGameMessage(result.message)
//         await fetchGameState()
//       } else {
//         setError(result.message || "Failed to play card")
//       }
//     } catch (error) {
//       console.error("Error playing card:", error)
//       setError("Error connecting to the game server")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleColorSelect = async (color) => {
//     if (!selectedCard) return

//     const [col, number] = selectedCard.split("_")
//     setSelectedColor(color)

//     // Map color selection to the appropriate wild card code
//     let playableCard = selectedCard

//     if (number === "0") {
//       if (color === "red") playableCard = "wild_0"
//       else if (color === "blue") playableCard = "wild_1"
//       else if (color === "green") playableCard = "wild_2"
//       else if (color === "yellow") playableCard = "wild_3"
//     } else if (number === "5") {
//       if (color === "red") playableCard = "wild_5"
//       else if (color === "blue") playableCard = "wild_6"
//       else if (color === "green") playableCard = "wild_7"
//       else if (color === "yellow") playableCard = "wild_8"
//     }

//     setShowColorPicker(false)

//     try {
//       setIsLoading(true)
//       const result = await playCard(playerID, gameID, playableCard)

//       if (result.success) {
//         setGameMessage(result.message)
//         await fetchGameState()
//       } else {
//         setError(result.message || "Failed to play wild card")
//       }
//     } catch (error) {
//       console.error("Error playing wild card:", error)
//       setError("Error connecting to the game server")
//     } finally {
//       setIsLoading(false)
//       setSelectedCard(null)
//     }
//   }

//   const handleDrawCard = async () => {
//     try {
//       setIsLoading(true)
//       const result = await drawCard(gameID, playerID)

//       if (result.success) {
//         const newCard = (result.new_card.charAt(0).toUpperCase() + result.new_card.slice(1)).replace("_", " ")
//         setGameMessage(`Drew a card: ${newCard}`)
//         await fetchGameState()
//       } else {
//         setError(result.message || "Failed to draw card")
//       }
//     } catch (error) {
//       console.error("Error drawing card:", error)
//       setError("Error connecting to the game server")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const startGame = async () => {
//     try {
//       setIsLoading(true)
//       const result = await initializeGame(gameID, playerID)

//       if (result.success) {
//         setGameMessage("Game started!")
//         await fetchGameState()
//       } else {
//         setError(result.message || "Failed to start game")
//       }
//     } catch (error) {
//       console.error("Error starting game:", error)
//       setError("Error connecting to the game server")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Render card component based on card string (color_value)
//   const renderCard = (cardString, index, playable = false) => {
//     const card = cardString.replace(/[^a-zA-Z0-9_]/g, "")
//     if (!card) return null

//     const [color, number] = card.split("_")
//     const cardProps = {
//       key: index,
//       className: "w-14 h-20 sm:w-16 sm:h-24",
//       onClick: playable ? () => handleCardPlay(card) : undefined,
//       disabled: !playable,
//     }

//     if (card === "wild_5") {
//       return <PlusFiveCard {...cardProps} />
//     } else if (color === "wild") {
//       return <WildCard {...cardProps} />
//     } else if (number === "skip") {
//       return <SkipCard color={color} {...cardProps} />
//     } else if (number === "reverse") {
//       return <ReverseCard color={color} {...cardProps} />
//     } else {
//       return <UnoCard color={color} number={number} {...cardProps} />
//     }
//   }

//   // Get the current player's position in the array
//   const getPlayerPosition = () => {
//     if (!gameState?.players) return -1
//     return gameState.players.findIndex((player) => player.playerID === playerID)
//   }

//   // Arrange other players in a circular layout
//   const renderOtherPlayers = () => {
//     if (!gameState?.players) return null

//     const playerIndex = getPlayerPosition()
//     if (playerIndex === -1) return null

//     // Rotate players so current player is always at index 0
//     const rotatedPlayers = [...gameState.players.slice(playerIndex), ...gameState.players.slice(0, playerIndex)]

//     // The first player is the current player, so we skip it
//     const otherPlayers = rotatedPlayers.slice(1)
//     const totalPlayers = otherPlayers.length

//     if (totalPlayers === 0) return null

//     return (
//       <div className="relative w-full h-full">
//         {otherPlayers.map((player, index) => {
//           // Calculate position based on total players and current index
//           let positionClass = ""

//           if (totalPlayers === 1) {
//             positionClass = "top-0 left-1/2 -translate-x-1/2"
//           } else if (totalPlayers === 2) {
//             positionClass = index === 0 ? "left-0 top-1/4" : "right-0 top-1/4"
//           } else if (totalPlayers === 3) {
//             if (index === 0) positionClass = "left-0 top-1/4"
//             else if (index === 1) positionClass = "top-0 left-1/2 -translate-x-1/2"
//             else positionClass = "right-0 top-1/4"
//           } else {
//             if (index === 0) positionClass = "left-0 top-1/4"
//             else if (index === 1) positionClass = "left-1/4 top-0"
//             else if (index === 2) positionClass = "right-1/4 top-0"
//             else positionClass = "right-0 top-1/4"
//           }

//           const isCurrentTurn = gameState.currentPlayer === player.playerID

//           return (
//             <div key={player.playerID} className={`absolute ${positionClass} transform p-1`}>
//               <div
//                 className={`flex flex-col items-center p-2 rounded-lg ${
//                   isCurrentTurn ? "bg-yellow-100 ring-2 ring-yellow-400" : "bg-gray-800 bg-opacity-70"
//                 }`}
//               >
//                 <div className={`font-bold mb-1 text-xs ${isCurrentTurn ? "text-yellow-800" : "text-white"}`}>
//                   {player.playerName || `Player ${index + 1}`}
//                 </div>
//                 <div className="flex">
//                   {Array(Math.min(player.cardCount || 0, 5))
//                     .fill(0)
//                     .map((_, i) => (
//                       <div key={i} className="transform -ml-4 first:ml-0" style={{ zIndex: 10 - i }}>
//                         <CardBack className="w-8 h-12" isDark={!isCurrentTurn} onClick={undefined} />
//                       </div>
//                     ))}
//                   {player.cardCount > 5 && (
//                     <div className="ml-1 flex items-center justify-center text-white text-xs">
//                       +{player.cardCount - 5}
//                     </div>
//                   )}
//                 </div>
//                 <div className={`mt-1 text-xs ${isCurrentTurn ? "text-yellow-800" : "text-white"}`}>
//                   {player.cardCount || 0} cards
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   // Loading state
//   if (isLoading && !gameState) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-b from-emerald-900 to-black">
//         <div className="text-white text-xl">Loading game...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col h-screen bg-[#3e8914] p-2 overflow-hidden">
//       {/* Game header with info */}
//       <div className="flex justify-between items-center mb-1">
//         <div className="text-white">
//           <h2 className="text-base font-bold">UNO Game</h2>
//           <p className="text-xs">Game ID: {gameID}</p>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex items-center text-xs">
//             <Users className="w-3 h-3 mr-1" />
//             <span>{gameState?.players?.length || 0}</span>
//           </div>
//           {gameState?.bettingAmount > 0 && (
//             <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex flex-col items-center text-xs">
//               <div className="flex items-center">
//                 <DollarSign className="w-3 h-3 mr-1" />
//                 <span>{gameState.bettingAmount}</span>
//               </div>
//               <div className="flex items-center">
//                 <Trophy className="w-3 h-3 mr-1" />
//                 <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

     

//       {/* Notifications */}
//       {error && (
//         <div className="fixed top-2 right-2 z-50 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded shadow-lg flex items-center text-xs">
//           <AlertCircle className="w-4 h-4 mr-1" />
//           <span>{error}</span>
//           <button className="ml-2" onClick={() => setError("")}>
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {gameMessage && (
//         <div className="fixed top-2 right-2 z-50 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded shadow-lg flex items-center text-xs">
//           <CheckCircle2 className="w-4 h-4 mr-1" />
//           <span>{gameMessage}</span>
//           <button className="ml-2" onClick={() => setGameMessage("")}>
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Waiting room */}
//       {gameState?.gameStatus === "waiting" && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
//           <div className="bg-white rounded-lg p-4 max-w-xs w-full text-center">
//             <h2 className="text-xl font-bold mb-3">Waiting for players...</h2>
//             <p className="mb-1 text-sm">
//               Game Code: <span className="font-mono font-bold">{gameID}</span>
//             </p>
//             <p className="mb-3 text-sm">Players: {gameState?.players?.length || 0}</p>

//             <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
//               {gameState?.players?.map((player, index) => (
//                 <div key={player.playerID} className="bg-gray-100 p-2 rounded text-xs">
//                   {player.playerName || `Player ${index + 1}`}
//                   {player.playerID === gameState.host && (
//                     <span className="ml-1 text-xs bg-yellow-200 px-1 rounded">Host</span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {gameState.host === playerID && (
//               <button
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
//                 onClick={startGame}
//               >
//                 Start Game
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Game board */}
//       <div className="flex-1 relative">
//         {/* Other players positioned around the board */}
//         {renderOtherPlayers()}

//         {/* Center play area */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
//           <div className="flex flex-row items-center space-x-4 bg-black bg-opacity-30 p-3 rounded-xl">
//             {/* Draw pile */}
//             <div className="text-center">
//               <CardBack
//                 className="w-14 h-20 sm:w-16 sm:h-24 mb-1 transition-transform active:scale-95"
//                 isDark={true}
//                 onClick={isPlayerTurn ? handleDrawCard : undefined}
//               />
//               <p className="text-white text-xs">Draw</p>
//             </div>

//             {/* Current card */}
//             <div className="text-center">
//               {gameState?.currentCard ? (
//                 <div className="relative">
//                   {isColoredWildCard && effectiveColor ? (
//                     <ColoredWildCard
//                       color={effectiveColor}
//                       className="w-14 h-20 sm:w-16 sm:h-24"
//                       onClick={undefined}
//                       disabled={!isPlayerTurn}
//                     />
//                   ) : isColoredWild5 && effectiveColor ? (
//                     <ColoredPlusFiveCard
//                       color={effectiveColor}
//                       className="w-14 h-20 sm:w-16 sm:h-24"
//                       onClick={undefined}
//                       disabled={!isPlayerTurn}
//                     />
//                   ) : (
//                     renderCard(gameState.currentCard)
//                   )}
//                 </div>
//               ) : (
//                 <div className="w-14 h-20 sm:w-16 sm:h-24 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
//                   <span className="text-white/50 text-xs">No Card</span>
//                 </div>
//               )}
//               <p className="text-white text-xs mt-1">Current</p>
//             </div>
//           </div>
//         </div>

//         {/* Game status */}
//         <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
//           <div
//             className={`px-3 py-1 rounded-full text-xs ${
//               isPlayerTurn ? "bg-yellow-400 text-yellow-900" : "bg-white/10 text-white"
//             }`}
//           >
//             {isPlayerTurn
//               ? "Your Turn!"
//               : `Waiting for ${gameState?.players.find((p) => p.playerID === gameState?.currentPlayer)?.playerName || "opponent"}'s turn`}
//           </div>
//         </div>
//       </div>

//       {/* Player's hand */}
//       <div className="mt-auto pt-2 pb-1">
//         <div className="flex justify-between items-center mb-1">
//           <h3 className="text-white text-sm font-bold">Your Hand ({currentPlayerName})</h3>
//           <div className="flex items-center gap-2">
//             <div className="text-white text-xs">{playerHand.length} cards</div>
//             <button
//               className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
//               onClick={() => setExpandedHand(!expandedHand)}
//             >
//               {expandedHand ? "Collapse" : "Expand"}
//             </button>
//           </div>
//         </div>

//         <div className={`flex justify-center overflow-x-auto pb-2 px-2 ${expandedHand ? "h-40" : "h-24"}`}>
//           {expandedHand ? (
//             // Grid layout for expanded view
//             <div className="grid grid-cols-4 gap-1 auto-rows-min w-full">
//               {playerHand.map((card, index) => (
//                 <div key={index} className="flex justify-center">
//                   {renderCard(card, index, isPlayerTurn)}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             // Fan layout for collapsed view
//             <div className="flex">
//               {playerHand.map((card, index) => (
//                 <div
//                   key={index}
//                   className={`transform transition-all duration-200 -ml-6 first:ml-0 ${
//                     isPlayerTurn ? "active:translate-y-0 touch-manipulation" : ""
//                   }`}
//                   style={{ zIndex: index + 1 }}
//                 >
//                   {renderCard(card, index, isPlayerTurn)}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Color picker dialog */}
//       {showColorPicker && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 max-w-xs w-full">
//             <h3 className="text-lg font-bold mb-3 text-center">Choose a color</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 className="bg-red-500 hover:bg-red-600 h-20 rounded-lg transition-colors active:scale-95"
//                 onClick={() => handleColorSelect("red")}
//               />
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 h-20 rounded-lg transition-colors active:scale-95"
//                 onClick={() => handleColorSelect("blue")}
//               />
//               <button
//                 className="bg-yellow-500 hover:bg-yellow-600 h-20 rounded-lg transition-colors active:scale-95"
//                 onClick={() => handleColorSelect("yellow")}
//               />
//               <button
//                 className="bg-green-500 hover:bg-green-600 h-20 rounded-lg transition-colors active:scale-95"
//                 onClick={() => handleColorSelect("green")}
//               />
//             </div>
//             <button
//               className="mt-3 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors text-sm"
//               onClick={() => {
//                 setShowColorPicker(false)
//                 setSelectedCard(null)
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  UnoCard,
  WildCard,
  CardBack,
  SkipCard,
  ReverseCard,
  PlusFiveCard,
  ColoredWildCard,
  ColoredPlusFiveCard,
} from "./cards/cardsM"
import { getGameState, playCard, drawCard, initializeGame } from "./../lib/api"
import { AlertCircle, CheckCircle2, X, Users, Trophy, DollarSign } from "lucide-react"

export default function UnoGameBoardMobile() {
  const { gameID, playerID } = useParams()
  const navigate = useNavigate()

  // Game state
  const [gameState, setGameState] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // UI state
  const [error, setError] = useState("")
  const [gameMessage, setGameMessage] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [expandedHand, setExpandedHand] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)

  // Derived state
  const isPlayerTurn = gameState?.currentPlayer === playerID
  const currentPlayerData = gameState?.players?.find((player) => player.playerID === playerID)
  const currentPlayerName = currentPlayerData?.playerName || playerID

  // Wild card color mapping
  const WILD_COLOR_MAP = {
    wild_0: "red",
    wild_1: "blue",
    wild_2: "green",
    wild_3: "yellow",
    wild_5: "red",
    wild_6: "blue",
    wild_7: "green",
    wild_8: "yellow",
  }

  const isColoredWildCard = ["wild_0", "wild_1", "wild_2", "wild_3"].includes(gameState?.currentCard)
  const isColoredWild5 = ["wild_5", "wild_6", "wild_7", "wild_8"].includes(gameState?.currentCard)
  const effectiveColor = WILD_COLOR_MAP[gameState?.currentCard]

  // Fetch game state at regular intervals
  useEffect(() => {
    fetchGameState()

    const intervalId = setInterval(() => {
      fetchGameState()
    }, 1000) // Poll every second

    return () => clearInterval(intervalId)
  }, [gameID, playerID])

  // Timer for player turns
  useEffect(() => {
    if (!gameState) {
      setTimeLeft(10)
      return
    }

    setTimeLeft(10)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoDraw()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState?.currentPlayer, isPlayerTurn])

  const handleAutoDraw = async () => {
    const playerRes = await fetch(
      `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getCurrentPlayer.php?action=getCurrentPlayer&gameID=${gameID}`,
    )
    const playerData = await playerRes.json()
    const player =
      typeof playerData.curPlayer === "string" ? JSON.parse(playerData.currentPlayer) : playerData.currentPlayer

    try {
      setIsLoading(true)
      const result = await drawCard(gameID, player, true)

      if (result.success) {
        const newCard = (result.new_card.charAt(0).toUpperCase() + result.new_card.slice(1)).replace("_", " ")
        setGameMessage(`Time's up! Drew a card: ${newCard}`)
        await fetchGameState()
      } else {
        setError(result.message || "Failed to draw card automatically")
      }
    } catch (error) {
      console.error("Error drawing card automatically:", error)
      setError("Error connecting to the game server")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGameState = async () => {
    try {
      setIsLoading(true)
      const state = await getGameState(gameID, playerID)

      if (state.success) {
        setGameState(state)

        // Redirect if game is finished
        if (String(state.gameStatus) === "finished") {
          navigate(`/winning/${gameID}`)
        }

        // Find the current player's data to get their hand
        const currentPlayerData = state.players.find((player) => player.playerID === playerID)
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
    const cleanedCard = card.replace(/[^a-zA-Z0-9_]/g, "")

    // If card is wild, show color picker
    if (cleanedCard.startsWith("wild_")) {
      setSelectedCard(cleanedCard)
      setShowColorPicker(true)
      return
    }

    try {
      setIsLoading(true)
      const result = await playCard(playerID, gameID, String(cleanedCard))

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

    const [col, number] = selectedCard.split("_")

    // Format the wild card with the selected color
    let playableCard = selectedCard

    if (number === "0") {
      if (color === "red") playableCard = "wild_0"
      else if (color === "blue") playableCard = "wild_1"
      else if (color === "green") playableCard = "wild_2"
      else if (color === "yellow") playableCard = "wild_3"
    } else if (number === "5") {
      if (color === "red") playableCard = "wild_5"
      else if (color === "blue") playableCard = "wild_6"
      else if (color === "green") playableCard = "wild_7"
      else if (color === "yellow") playableCard = "wild_8"
    }

    setShowColorPicker(false)

    try {
      setIsLoading(true)
      const result = await playCard(playerID, gameID, playableCard)

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
      const result = await drawCard(gameID, playerID, false)

      if (result.success) {
        const newCard = (result.new_card.charAt(0).toUpperCase() + result.new_card.slice(1)).replace("_", " ")
        setGameMessage(`Drew a card: ${newCard}`)
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
      const result = await initializeGame(gameID, playerID)

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
  const renderCard = (cardString, index, playable = false) => {
    const card = cardString.replace(/[^a-zA-Z0-9_]/g, "")
    if (!card) return null

    const [color, number] = card.split("_")
    const cardProps = {
      key: index,
      className: "w-14 h-20 sm:w-16 sm:h-24",
      onClick: playable ? () => handleCardPlay(card) : undefined,
      disabled: !playable,
    }

    if (card === "wild_5") {
      return <PlusFiveCard {...cardProps} />
    } else if (color === "wild") {
      return <WildCard {...cardProps} />
    } else if (number === "skip") {
      return <SkipCard color={color} {...cardProps} />
    } else if (number === "reverse") {
      return <ReverseCard color={color} {...cardProps} />
    } else {
      return <UnoCard color={color} number={number} {...cardProps} />
    }
  }

  // Get the current player's position in the array
  const getPlayerPosition = () => {
    if (!gameState?.players) return -1
    return gameState.players.findIndex((player) => player.playerID === playerID)
  }

  // Arrange other players in a circular layout
  const renderOtherPlayers = () => {
    if (!gameState?.players) return null

    const playerIndex = getPlayerPosition()
    if (playerIndex === -1) return null

    // Rotate players so current player is always at index 0
    const rotatedPlayers = [...gameState.players.slice(playerIndex), ...gameState.players.slice(0, playerIndex)]

    // The first player is the current player, so we skip it
    const otherPlayers = rotatedPlayers.slice(1)
    const totalPlayers = otherPlayers.length

    if (totalPlayers === 0) return null

    return (
      <div className="relative w-full h-full">
        {otherPlayers.map((player, index) => {
          // Calculate position based on total players and current index
          let positionClass = ""

          if (totalPlayers === 1) {
            positionClass = "top-0 left-1/2 -translate-x-1/2"
          } else if (totalPlayers === 2) {
            positionClass = index === 0 ? "left-0 top-1/4" : "right-0 top-1/4"
          } else if (totalPlayers === 3) {
            if (index === 0) positionClass = "left-0 top-1/4"
            else if (index === 1) positionClass = "top-0 left-1/2 -translate-x-1/2"
            else positionClass = "right-0 top-1/4"
          } else {
            if (index === 0) positionClass = "left-0 top-1/4"
            else if (index === 1) positionClass = "left-1/4 top-0"
            else if (index === 2) positionClass = "right-1/4 top-0"
            else positionClass = "right-0 top-1/4"
          }

          const isCurrentTurn = gameState.currentPlayer === player.playerID

          return (
            <div key={player.playerID} className={`absolute ${positionClass} transform p-1`}>
              <div
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isCurrentTurn ? "bg-yellow-100 ring-2 ring-yellow-400" : "bg-gray-800 bg-opacity-70"
                }`}
              >
                <div className={`font-bold mb-1 text-xs ${isCurrentTurn ? "text-yellow-800" : "text-white"}`}>
                  {player.playerName || `Player ${index + 1}`}
                </div>
                <div className="flex">
                  {Array(Math.min(player.cardCount || 0, 5))
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="transform -ml-4 first:ml-0" style={{ zIndex: 10 - i }}>
                        <CardBack className="w-8 h-12" isDark={!isCurrentTurn} onClick={undefined} />
                      </div>
                    ))}
                  {player.cardCount > 5 && (
                    <div className="ml-1 flex items-center justify-center text-white text-xs">
                      +{player.cardCount - 5}
                    </div>
                  )}
                </div>
                <div className={`mt-1 text-xs ${isCurrentTurn ? "text-yellow-800" : "text-white"}`}>
                  {player.cardCount || 0} cards
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Loading state
  if (isLoading && !gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-emerald-900 to-black">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#3e8914] p-2 overflow-hidden">
      {/* Game header with info */}
      <div className="flex justify-between items-center mb-1">
        <div className="text-white">
          <h2 className="text-base font-bold">UNO Game</h2>
          <p className="text-xs">Game ID: {gameID}</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex items-center text-xs">
            <Users className="w-3 h-3 mr-1" />
            <span>{gameState?.players?.length || 0}</span>
          </div>
          {gameState?.bettingAmount > 0 && (
            <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex flex-col items-center text-xs">
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                <span>{gameState.bettingAmount}</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-3 h-3 mr-1" />
                <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="fixed top-2 right-2 z-50 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded shadow-lg flex items-center text-xs">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
          <button className="ml-2" onClick={() => setError("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {gameMessage && (
        <div className="fixed top-2 right-2 z-50 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded shadow-lg flex items-center text-xs">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          <span>{gameMessage}</span>
          <button className="ml-2" onClick={() => setGameMessage("")}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Waiting room */}
      {gameState?.gameStatus === "waiting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
          <div className="bg-white rounded-lg p-4 max-w-xs w-full text-center">
            <h2 className="text-xl font-bold mb-3">Waiting for players...</h2>
            <p className="mb-1 text-sm">
              Game Code: <span className="font-mono font-bold">{gameID}</span>
            </p>
            <p className="mb-3 text-sm">Players: {gameState?.players?.length || 0}</p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {gameState?.players?.map((player, index) => (
                <div key={player.playerID} className="bg-gray-100 p-2 rounded text-xs">
                  {player.playerName || `Player ${index + 1}`}
                  {player.playerID === gameState.host && (
                    <span className="ml-1 text-xs bg-yellow-200 px-1 rounded">Host</span>
                  )}
                </div>
              ))}
            </div>

            {gameState.host === playerID && (
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex flex-row items-center space-x-4 bg-black bg-opacity-30 p-3 rounded-xl">
            {/* Draw pile */}
            <div className="text-center">
              <CardBack
                className="w-14 h-20 sm:w-16 sm:h-24 mb-1 transition-transform active:scale-95"
                isDark={true}
                onClick={isPlayerTurn ? handleDrawCard : undefined}
              />
              <p className="text-white text-xs">Draw</p>
            </div>

            {/* Current card */}
            <div className="text-center">
              {gameState?.currentCard ? (
                <div className="relative">
                  {isColoredWildCard && effectiveColor ? (
                    <ColoredWildCard
                      color={effectiveColor}
                      className="w-14 h-20 sm:w-16 sm:h-24"
                      onClick={undefined}
                      disabled={!isPlayerTurn}
                    />
                  ) : isColoredWild5 && effectiveColor ? (
                    <ColoredPlusFiveCard
                      color={effectiveColor}
                      className="w-14 h-20 sm:w-16 sm:h-24"
                      onClick={undefined}
                      disabled={!isPlayerTurn}
                    />
                  ) : (
                    renderCard(gameState.currentCard)
                  )}
                </div>
              ) : (
                <div className="w-14 h-20 sm:w-16 sm:h-24 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-white/50 text-xs">No Card</span>
                </div>
              )}
              <p className="text-white text-xs mt-1">Current</p>
            </div>
          </div>
        </div>

        {/* Game status */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div
            className={`px-3 py-1 rounded-full text-xs ${
              isPlayerTurn ? "bg-yellow-400 text-yellow-900" : "bg-white/10 text-white"
            }`}
          >
            {isPlayerTurn ? (
              <>
                Your Turn! ({timeLeft}s)
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-yellow-800 h-1.5 rounded-full" style={{ width: `${(timeLeft / 10) * 100}%` }} />
                </div>
              </>
            ) : (
              `Waiting for ${gameState?.players.find((p) => p.playerID === gameState?.currentPlayer)?.playerName || "opponent"}'s turn`
            )}
          </div>
        </div>
      </div>

      {/* Player's hand */}
      <div className="mt-auto pt-2 pb-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-white text-sm font-bold">Your Hand ({currentPlayerName})</h3>
          <div className="flex items-center gap-2">
            <div className="text-white text-xs">{playerHand.length} cards</div>
            <button
              className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
              onClick={() => setExpandedHand(!expandedHand)}
            >
              {expandedHand ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        <div className={`flex justify-center overflow-x-auto pb-2 px-2 ${expandedHand ? "h-40" : "h-24"}`}>
          {expandedHand ? (
            // Grid layout for expanded view
            <div className="grid grid-cols-4 gap-1 auto-rows-min w-full">
              {playerHand.map((card, index) => (
                <div key={index} className="flex justify-center">
                  {renderCard(card, index, isPlayerTurn)}
                </div>
              ))}
            </div>
          ) : (
            // Fan layout for collapsed view
            <div className="flex">
              {playerHand.map((card, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-200 -ml-6 first:ml-0 ${
                    isPlayerTurn ? "active:translate-y-4 touch-manipulation" : ""
                  }`}
                  style={{ zIndex: index + 1 }}
                >
                  {renderCard(card, index, isPlayerTurn)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Color picker dialog */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-3 text-center">Choose a color</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="bg-red-500 hover:bg-red-600 h-20 rounded-lg transition-colors active:scale-95"
                onClick={() => handleColorSelect("red")}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 h-20 rounded-lg transition-colors active:scale-95"
                onClick={() => handleColorSelect("blue")}
              />
              <button
                className="bg-yellow-500 hover:bg-yellow-600 h-20 rounded-lg transition-colors active:scale-95"
                onClick={() => handleColorSelect("yellow")}
              />
              <button
                className="bg-green-500 hover:bg-green-600 h-20 rounded-lg transition-colors active:scale-95"
                onClick={() => handleColorSelect("green")}
              />
            </div>
            <button
              className="mt-3 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors text-sm"
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
