// import React, { useState, useEffect } from 'react';
// import { UnoCard, WildCard, CardBack, ColorPicker } from './cards/cards';
// import { getGameState, playCard, drawCard, initializeGame } from './../lib/api';

// export default function UnoGameBoard({ gameID, playerID }) {
//   const [gameState, setGameState] = useState(null);
//   const [playerHand, setPlayerHand] = useState([]);
//   const [error, setError] = useState('');
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [gameMessage, setGameMessage] = useState('');

//   // Fetch game state at regular intervals
//   useEffect(() => {
//     fetchGameState();
    
//     const intervalId = setInterval(() => {
//       fetchGameState();
//     }, 3000); // Poll every 3 seconds
    
//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchGameState = async () => {
//     try {
//       setIsLoading(true);
//       const state = await getGameState(gameID, playerID);
      
//       if (state.success) {
//         setGameState(state);
        
//         // Find the current player's data to get their hand
//         const currentPlayerData = state.players.find(player => player.playerID === playerID);
//         if (currentPlayerData && currentPlayerData.cardList) {
//           setPlayerHand(currentPlayerData.cardList.split(','));
//         }
//       } else {
//         setError(state.message || 'Failed to load game state');
//       }
//     } catch (error) {
//       console.error('Error fetching game state:', error);
//       setError('Error connecting to the game server');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCardPlay = async (card) => {
//     // If card is wild, show color picker
//     if (card.startsWith('wild_')) {
//       setSelectedCard(card);
//       setShowColorPicker(true);
//       return;
//     }
    
//     try {
//       setIsLoading(true);
//       const result = await playCard(playerID, gameID, card);
      
//       if (result.success) {
//         setGameMessage(result.message);
//         await fetchGameState(); // Refresh game state after playing
//       } else {
//         setError(result.message || 'Failed to play card');
//       }
//     } catch (error) {
//       console.error('Error playing card:', error);
//       setError('Error connecting to the game server');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleColorSelect = async (color) => {
//     if (!selectedCard) return;
    
//     // Format the wild card with the selected color
//     const playableCard = selectedCard;
//     setShowColorPicker(false);
    
//     try {
//       setIsLoading(true);
//       const result = await playCard(playerID, gameID, playableCard);
      
//       if (result.success) {
//         setGameMessage(result.message);
//         await fetchGameState(); // Refresh game state after playing
//       } else {
//         setError(result.message || 'Failed to play wild card');
//       }
//     } catch (error) {
//       console.error('Error playing wild card:', error);
//       setError('Error connecting to the game server');
//     } finally {
//       setIsLoading(false);
//       setSelectedCard(null);
//     }
//   };

//   const handleDrawCard = async () => {
//     try {
//       setIsLoading(true);
//       const result = await drawCard(gameID, playerID);
      
//       if (result.success) {
//         setGameMessage(`Drew a card: ${result.new_card}`);
//         await fetchGameState(); // Refresh game state after drawing
//       } else {
//         setError(result.message || 'Failed to draw card');
//       }
//     } catch (error) {
//       console.error('Error drawing card:', error);
//       setError('Error connecting to the game server');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startGame = async () => {
//     try {
//       setIsLoading(true);
//       const result = await initializeGame(gameID, playerID);
      
//       if (result.success) {
//         setGameMessage('Game started!');
//         await fetchGameState(); // Refresh game state after starting
//       } else {
//         setError(result.message || 'Failed to start game');
//       }
//     } catch (error) {
//       console.error('Error starting game:', error);
//       setError('Error connecting to the game server');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Render card component based on card string (color_value)
//   const renderCard = (card, index, playable = false) => {
//     if (!card) return null;
    
//     const [color, number] = card.split('_');
    
//     if (color === 'wild') {
//       return (
//         <WildCard
//           key={index}
//           className="w-16 h-24 sm:w-20 sm:h-28"
//           onClick={playable ? () => handleCardPlay(card) : undefined}
//           disabled={!playable}
//         />
//       );
//     } else {
//       return (
//         <UnoCard
//           key={index}
//           color={color}
//           number={number}
//           className="w-16 h-24 sm:w-20 sm:h-28"
//           onClick={playable ? () => handleCardPlay(card) : undefined}
//           disabled={!playable}
//         />
//       );
//     }
//   };

//   const isPlayerTurn = gameState?.currentPlayer === playerID;

//   // Layout for other players based on total number of players
//   const renderOtherPlayers = () => {
//     if (!gameState || !gameState.players) return null;
    
//     const otherPlayers = gameState.players.filter(player => player.playerID !== playerID);
    
//     // Center players evenly around the top of the board
//     return (
//       <div className="flex flex-wrap justify-center">
//         {otherPlayers.map((player, index) => (
//           <div 
//             key={player.playerID} 
//             className={`flex flex-col items-center m-2 p-4 rounded-lg ${gameState.currentPlayer === player.playerID ? 'bg-yellow-100' : 'bg-gray-100'}`}
//           >
//             <div className="font-bold mb-2">{player.playerName || player.playerID}</div>
//             <div className="flex">
//               {Array(player.cardCount || 0).fill(0).map((_, i) => (
//                 <div key={i} className="transform -rotate-90 -ml-10 first:ml-0">
//                   <CardBack 
//                     className="w-12 h-16 sm:w-14 sm:h-20" 
//                     isDark={true}
//                     onClick={isPlayerTurn ? handleDrawCard : undefined}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="mt-2 text-sm">{player.cardCount || 0} cards</div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (isLoading && !gameState) {
//     return <div className="flex items-center justify-center h-screen">Loading game...</div>;
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-black p-4">
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//           <button 
//             className="float-right" 
//             onClick={() => setError('')}
//           >
//             &times;
//           </button>
//         </div>
//       )}
      
//       {gameMessage && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {gameMessage}
//           <button 
//             className="float-right" 
//             onClick={() => setGameMessage('')}
//           >
//             &times;
//           </button>
//         </div>
//       )}
      
//       {gameState?.gameStatus === 'waiting' && gameState.host === playerID && (
//         <div className="text-center mb-4">
//           <button 
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//             onClick={startGame}
//           >
//             Start Game
//           </button>
//         </div>
//       )}
      
//       {gameState?.gameStatus === 'waiting' && (
//         <div className="text-center mb-4 text-white">
//           <h2 className="text-xl font-bold">Waiting for players...</h2>
//           <p>Game Code: {gameID}</p>
//           <p>Players: {gameState?.players?.length || 0}</p>
//         </div>
//       )}

//       {/* Other players */}
//       <div className="mb-8">
//         {renderOtherPlayers()}
//       </div>
      
//       {/* Center play area */}
//       <div className="flex items-center justify-center mb-8">
//         <div className="flex flex-row items-center space-x-8">
//           {/* Draw pile */}
//           <div className="text-center">
//             <CardBack 
//               className="w-20 h-32 sm:w-24 sm:h-36 mb-2" 
//               isDark={true} 
//               onClick={isPlayerTurn ? handleDrawCard : undefined}
//             />
//             <p className="text-white text-sm">Draw</p>
//           </div>
          
//           {/* Current card */}
//           <div className="text-center">
//             {gameState?.currentCard && renderCard(gameState.currentCard)}
//             <p className="text-white text-sm mt-2">Current Card</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Game info */}
//       <div className="text-center mb-4 text-white">
//         <h3 className="text-lg font-bold">
//           {isPlayerTurn ? "Your Turn!" : `Waiting for ${gameState?.currentPlayer}'s turn`}
//         </h3>
//         <p>Betting Amount: ${gameState?.bettingAmount || 0}</p>
//       </div>
      
//       {/* Player's hand */}
//       <div className="mt-auto">
//         <h3 className="text-white text-lg font-bold mb-2 text-center">Your Hand</h3>
//         <div className="flex flex-wrap justify-center">
//           {playerHand.map((card, index) => (
//             <div key={index} className="transform hover:-translate-y-4 transition-transform duration-200 mx-1">
//               {renderCard(card, index, isPlayerTurn)}
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Color picker dialog */}
//       {showColorPicker && (
//         <ColorPicker 
//           onSelectColor={handleColorSelect} 
//           onClose={() => {
//             setShowColorPicker(false);
//             setSelectedCard(null);
//           }} 
//         />
//       )}
//     </div>
//   );
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate , useParams} from "react-router-dom";
// import { UnoCard, WildCard, CardBack, SkipCard, ReverseCard, PlusFiveCard, ColoredWildCard, ColoredPlusFiveCard} from "./cards/cards"
// import { getGameState, playCard, drawCard, initializeGame } from "./../lib/api"
// import { AlertCircle, CheckCircle2, X, Users, Trophy, DollarSign } from "lucide-react"

// export default function UnoGameBoard() {
//   const { gameID, playerID } = useParams()
//   const [gameState, setGameState] = useState(null)
//   const [playerHand, setPlayerHand] = useState([])
//   const [error, setError] = useState("")
//   const [showColorPicker, setShowColorPicker] = useState(false)
//   const [selectedCard, setSelectedCard] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [gameMessage, setGameMessage] = useState("")
//   const [selectedColor, setSelectedColor] = useState(null)
//   const navigate = useNavigate()

//   // Fetch game state at regular intervals
//   useEffect(() => {
//     fetchGameState()

//     const intervalId = setInterval(() => {
//       fetchGameState()
//     }, 1000) // Poll every 3 seconds

//     return () => clearInterval(intervalId)
//   }, [])

//   const fetchGameState = async () => {
//     try {
//       setIsLoading(true)
//       const state = await getGameState(gameID, playerID)

//       if (state.success) {
//         setGameState(state)
//         if (String(state.gameStatus) === "finished") {
//           if(state.host === playerID){
//             navigate(`/host-game-lobby/${gameID}`)
//           }
//           else{
//             navigate(`/waiting-host/${gameID}`)
//           }
//         }

//         // Find the current player's data to get their hand
//         const currentPlayerData = state.players.find((player) => player.playerID === playerID)
//         if (currentPlayerData && currentPlayerData.cardList) {
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

//   const handleCardPlay = async (card) => {
//     const cleaned = card.replace(/[^a-zA-Z0-9_]/g, '');
    
//     // If card is wild, show color picker
//     //TODO: add colorpicker to work
//      if (card.startsWith("wild_")) {
//       setSelectedCard(card)
//       setShowColorPicker(true)
//       return
//      }
//     console.log("Playing card:", cleaned)

//     try {
//         console.log("Playing card in console:", cleaned)
//       setIsLoading(true)
//       const result = await playCard(playerID, gameID, String(cleaned))
//     console.log("Result:", result);
//       if (result.success) {

//         setGameMessage(result.message)
//         await fetchGameState() // Refresh game state after playing
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
//     const[col, number] = selectedCard.split("_");
//     setSelectedColor(color)
//     // Format the wild card with the selected color
//     let playableCard = selectedCard
//     setShowColorPicker(false)
//     if (number === "0"){
//       if(color == "red"){
//         playableCard = "wild_0";
//       }
//       else if(color == "blue"){
//         playableCard = "wild_1";
//       }

//       else if(color == "green"){
//         playableCard = "wild_2";
//       }

//       else if(color == "yellow"){
//         playableCard = "wild_3";
//       }
//     }
//     else if (number == "5"){
//       if(color == "red"){
//         playableCard = "wild_5";
//       }
//       else if(color == "blue"){
//         playableCard = "wild_6";
//       }

//       else if(color == "green"){
//         playableCard = "wild_7";
//       }

//       else if(color == "yellow"){
//         playableCard = "wild_8";
//       }
//     }

//     try {
//       setIsLoading(true)
//       const result = await playCard(playerID, gameID, playableCard)

//       if (result.success) {
//         setGameMessage(result.message)
//         await fetchGameState() // Refresh game state after playing
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
//         const newCard = (result.new_card.charAt(0).toUpperCase() + result.new_card.slice(1)).replace("_", ' ');
//         setGameMessage(`Drew a card: ${newCard}`)
//         await fetchGameState() // Refresh game state after drawing
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
//         await fetchGameState() // Refresh game state after starting
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
//   const renderCard = (cardC, index, playable = false) => {
//     const card = cardC.replace(/[^a-zA-Z0-9_]/g, '');
//     if (!card) return null

//     const [color, number] = card.split("_");

//     if (card === "wild_5"){
//       return(
//         <PlusFiveCard
//         key={index}
//         className="w-16 h-24 sm:w-20 sm:h-28"
//         onClick={playable ? () => handleCardPlay(card) : undefined}
//         disabled={!playable}
//         />
//       )
//   }

//     else if (color === "wild") {
//       return (
//         <WildCard
//           key={index}
//           className="w-16 h-24 sm:w-20 sm:h-28"
//           onClick={playable ? () => handleCardPlay(card): undefined}
//           disabled={!playable}
//         />
//       )
//     } 
//     else if (number === "skip"){
//       return(
//         <SkipCard
//         key={index}
//         color={color}
//         className="w-16 h-24 sm:w-20 sm:h-28"
//         onClick={playable ? () => handleCardPlay(card) : undefined}
//         disabled={!playable}
//         />
//       )
//     }
    
//     else if (number === "reverse"){
//       return(
//         <ReverseCard
//         key={index}
//         color={color}
//         className="w-16 h-24 sm:w-20 sm:h-28"
//         onClick={playable ? () => handleCardPlay(card) : undefined}
//         disabled={!playable}
//         />
//       )
//     }

 
//     else {
//       return (
//         <UnoCard
//           key={index}
//           color={color}
//           number={number}
//           className="w-16 h-24 sm:w-20 sm:h-28"
//           onClick={playable ? () => handleCardPlay(card) : undefined}
//           disabled={!playable}
//         />
//       )
//     }
//   }

//   const isPlayerTurn = gameState?.currentPlayer === playerID
//   const currentPlayerData = gameState?.players?.find((player) => player.playerID === playerID)
//   const currentPlayerName = currentPlayerData?.playerName || playerID

//   // Get the current player's position in the array
//   const getPlayerPosition = () => {
//     if (!gameState?.players) return -1
//     return gameState.players.findIndex((player) => player.playerID === playerID)
//   }

//   // Arrange other players in a circular layout
//   const renderOtherPlayers = () => {
//     if (!gameState?.players) return null;

//     const playerIndex = getPlayerPosition();
//     if (playerIndex === -1) return null;

//     // Rotate players so current player is always at index 0
//     const rotatedPlayers = [
//       ...gameState.players.slice(playerIndex),
//       ...gameState.players.slice(0, playerIndex),
//     ].reverse();

//     const otherPlayers = rotatedPlayers.slice(1);
//     const totalPlayers = otherPlayers.length;

//     if (totalPlayers === 0) return null;

//     // Calculate positions based on number of players
//     return (
//       <div className="relative w-full h-full">
//         {otherPlayers.map((player, index) => {
//           // Calculate position based on total players and current index
//           let positionClass = ""

//           if (totalPlayers <= 2) {
//             // For 3 players total (2 opponents)
//             positionClass = index === 0 ? "left-0" : "right-0"
//           } else if (totalPlayers === 3) {
//             // For 4 players total (3 opponents)
//             if (index === 0) positionClass = "left-0"
//             else if (index === 1) positionClass = "top-0 left-1/2 -translate-x-1/2"
//             else positionClass = "right-0"
//           } else if (totalPlayers === 4) {
//             // For 5 players total (4 opponents)
//             if (index === 0) positionClass = "left-0 top-1/4"
//             else if (index === 1) positionClass = "left-1/4 top-0"
//             else if (index === 2) positionClass = "right-1/4 top-0"
//             else positionClass = "right-0 top-1/4"
//           } else {
//             // For 6 players total (5 opponents)
//             if (index === 0) positionClass = "left-0 top-1/3"
//             else if (index === 1) positionClass = "left-1/5 top-0"
//             else if (index === 2) positionClass = "top-0 left-1/2 -translate-x-1/2"
//             else if (index === 3) positionClass = "right-1/5 top-0"
//             else positionClass = "right-0 top-1/3"
//           }

//           return (
//             <div key={player.playerID} className={`absolute ${positionClass} transform p-2`}>
//               <div
//                 className={`flex flex-col items-center p-3 rounded-lg ${
//                   gameState.currentPlayer === player.playerID
//                     ? "bg-yellow-100 ring-2 ring-yellow-400"
//                     : "bg-gray-800 bg-opacity-70"
//                 }`}
//               >
//                 <div
//                   className={`font-bold mb-1 text-sm ${
//                     gameState.currentPlayer === player.playerID ? "text-yellow-800" : "text-white"
//                   }`}
//                 >
//                   {player.playerName || `Player ${index + 1}`}
//                 </div>
//                 <div className="flex">
//                   {Array(Math.min(player.cardCount || 0, 7))
//                     .fill(0)
//                     .map((_, i) => (
//                       <div key={i} className="transform -ml-6 first:ml-0" style={{ zIndex: 10 - i }}>
//                         <CardBack className="w-10 h-14" isDark={gameState.currentPlayer !== player.playerID} onClick={undefined}/>
//                       </div>
//                     ))}
//                   {player.cardCount > 7 && (
//                     <div className="ml-1 flex items-center justify-center text-white text-xs">
//                       +{player.cardCount - 7}
//                     </div>
//                   )}
//                 </div>
//                 <div
//                   className={`mt-1 text-xs ${
//                     gameState.currentPlayer === player.playerID ? "text-yellow-800" : "text-white"
//                   }`}
//                 >
//                   {player.cardCount || 0} cards
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   if (isLoading && !gameState) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-b from-emerald-900 to-black">
//         <div className="text-white text-xl">Loading game...</div>
//       </div>
//     )
//   }

//   const wildColorMap = {
//     wild_0: "red",
//     wild_1: "blue",
//     wild_2: "green",
//     wild_3: "yellow",
//     wild_5: "red",
//     wild_6: "blue",
//     wild_7: "green",
//     wild_8: "yellow",
//   };
  
//   const isColoredWildCard = ["wild_0", "wild_1", "wild_2", "wild_3"].includes(gameState?.currentCard);
//   const isColoredWild5 = ["wild_5", "wild_6", "wild_7", "wild_8"].includes(gameState?.currentCard);
//   const effectiveColor = wildColorMap[gameState?.currentCard];
  
//   return (
//     <div className="flex flex-col h-screen bg-[#3e8914] from-emerald-900 to-black p-4 overflow-hidden">
//       {/* Game header with info */}
//       <div className="flex justify-between items-center mb-2">
//         <div className="text-white">
//           <h2 className="text-lg font-bold">UNO Game</h2>
//           <p className="text-sm">Game ID: {gameID}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
//             <Users className="w-4 h-4 mr-1" />
//             <span>{gameState?.players?.length || 0} players</span>
//           </div>
//           {gameState?.bettingAmount > 0 && (
//             <div className="bg-black flex flex-col bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
//                 <div className="flex items-center">
//                     <DollarSign className="w-4 h-4 mr-1" />
//                     <span>{gameState.bettingAmount}</span>
//                 </div>

//                 <div className="flex items-center">
//                     <Trophy className="w-4 h-4 mr-1" />
//                     <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
//                 </div>
//             </div>
            
//           )}
//         </div>
//       </div>

//       {/* Notifications */}
//       {error && (
//         <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg flex items-center">
//           <AlertCircle className="w-5 h-5 mr-2" />
//           <span>{error}</span>
//           <button className="ml-4" onClick={() => setError("")}>
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {gameMessage && (
//         <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center">
//           <CheckCircle2 className="w-5 h-5 mr-2" />
//           <span>{gameMessage}</span>
//           <button className="ml-4" onClick={() => setGameMessage("")}>
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* Waiting room */}
//       {gameState?.gameStatus === "waiting" && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
//             <h2 className="text-2xl font-bold mb-4">Waiting for players...</h2>
//             <p className="mb-2">
//               Game Code: <span className="font-mono font-bold">{gameID}</span>
//             </p>
//             <p className="mb-4">Players: {gameState?.players?.length || 0}</p>

//             <div className="grid grid-cols-2 gap-2 mb-6">
//               {gameState?.players?.map((player, index) => (
//                 <div key={player.playerID} className="bg-gray-100 p-2 rounded">
//                   {player.playerName || `Player ${index + 1}`}
//                   {player.playerID === gameState.host && (
//                     <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">Host</span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {gameState.host === playerID && (
//               <button
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
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
//       </div>
//         {/* Other players positioned around the board */}
//         {renderOtherPlayers()}

//         {/* Center play area */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex items-center justify-center">
//           <div className="flex flex-row items-center space-x-8 bg-black bg-opacity-30 p-6 rounded-xl">
//             {/* Draw pile */}
//             <div className="text-center">
//               <CardBack
//                 className="w-20 h-32 sm:w-24 sm:h-36 mb-2 transition-transform hover:scale-105"
//                 isDark={true}
//                 onClick={isPlayerTurn ? handleDrawCard : undefined}
//               />
//               <p className="text-white text-sm">Draw Pile</p>
//             </div>

//             {/* Current card */}
//             <div className="text-center">
//                 {gameState?.currentCard ? (
//                   <div className="relative">
//                     {isColoredWildCard && effectiveColor ? (
//                       <ColoredWildCard
//                         color={effectiveColor}
//                         className="w-16 h-24 sm:w-20 sm:h-28"
//                         onClick={undefined}
//                         disabled={!isPlayerTurn}
//                       />
//                     ) : isColoredWild5 && effectiveColor ? (
//                       <ColoredPlusFiveCard
//                         color={effectiveColor}
//                         className="w-16 h-24 sm:w-20 sm:h-28"
//                         onClick={undefined}
//                         disabled={!isPlayerTurn}
//                       />
//                     ) : (
//                       renderCard(gameState.currentCard)
//                     )}
//                   </div>
//                 ) : (
//                   <div className="w-20 h-32 sm:w-24 sm:h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
//                     <span className="text-white/50">No Card</span>
//                   </div>
//                 )}
//                 <p className="text-white text-sm mt-2">Current Card</p>
//               </div>

//         </div>



//         {/* Game status */}
//         <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
//           <div
//             className={`px-4 py-2 rounded-full ${
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
//       <div className="mt-auto pt-4 pb-2">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-white text-lg font-bold">Your Hand ({currentPlayerName})</h3>
//           <div className="text-white text-sm">{playerHand.length} cards</div>
//         </div>

//         <div className="flex justify-center overflow-x-auto pb-4 px-4">
//           <div className="flex">
//             {playerHand.map((card, index) => (
//               <div
//                 key={index}
//                 className={`transform transition-all duration-200 -ml-8 first:ml-0 hover:translate-y--16 ${
//                   isPlayerTurn ? "hover:-translate-y-8" : ""
//                 }`}
//                 style={{ zIndex: index + 1 }}
//               >
//                 {renderCard(card, index, isPlayerTurn)}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Color picker dialog */}
//       {showColorPicker && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full">
//             <h3 className="text-xl font-bold mb-4 text-center">Choose a color</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 className="bg-red-500 hover:bg-red-600 h-24 rounded-lg transition-colors"
//                 onClick={() => handleColorSelect("red")}
//               />
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 h-24 rounded-lg transition-colors"
//                 onClick={() => handleColorSelect("blue")}
//               />
//               <button
//                 className="bg-yellow-500 hover:bg-yellow-600 h-24 rounded-lg transition-colors"
//                 onClick={() => handleColorSelect("yellow")}
//               />
//               <button
//                 className="bg-green-500 hover:bg-green-600 h-24 rounded-lg transition-colors"
//                 onClick={() => handleColorSelect("green")}
//               />
//             </div>
//             <button
//               className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors"
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
} from "./cards/cards"
import { getGameState, playCard, drawCard, initializeGame } from "../lib/api"
import { AlertCircle, CheckCircle2, X, Users, Trophy, DollarSign } from "lucide-react"

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

export default function UnoGameBoard() {
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
  const [selectedColor, setSelectedColor] = useState(null)

  // Derived state
  const isPlayerTurn = gameState?.currentPlayer === playerID
  const currentPlayerData = gameState?.players?.find((player) => player.playerID === playerID)
  const currentPlayerName = currentPlayerData?.playerName || playerID
  const isColoredWildCard = ["wild_0", "wild_1", "wild_2", "wild_3"].includes(gameState?.currentCard)
  const isColoredWild5 = ["wild_5", "wild_6", "wild_7", "wild_8"].includes(gameState?.currentCard)
  const effectiveColor = WILD_COLOR_MAP[gameState?.currentCard]

  //End game state
  const [showWinner, setShowWinner] = useState(false)
  const [winnerInfo, setWinnerInfo] = useState({ winner: "Unknown", bettingRemain: 0 })

  // Fetch game state at regular intervals
  useEffect(() => {
    fetchGameState()

    const intervalId = setInterval(() => {
      fetchGameState()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchGameState = async () => {
    try {
      setIsLoading(true)
      const state = await getGameState(gameID, playerID)

      if (state.success) {
        setGameState(state)

        // Redirect if game is finished
        if (String(state.gameStatus) === "finished" && !showWinner) {
          handleGameEnd();
        }

        // Update player hand
        const currentPlayerData = state.players.find((player) => player.playerID === playerID)
        if (currentPlayerData?.cardList) {
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
  
  const handleGameEnd = async () => {
    try {
      const playerRes = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerList.php?action=getPlayerList&gameID=${gameID}`);
      const playerData = await playerRes.json();
      const players = typeof playerData.players === "string" ? JSON.parse(playerData.players) : playerData.players;
  
      let winnerName = "Unknown";
      let winnerID = "";
      const betAmount = playerData.betAmount || 0;
      const totalPlayer = players.length;
      const moneyToSet = (betAmount * totalPlayer).toFixed(2);
  
      for (const player of players) {
        const cardRes = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerCardList.php?action=getPlayerCardList&gameID=${gameID}&playerID=${player.playerID}`);
        const cardData = await cardRes.json();
        const cardList = cardData.cardList ? cardData.cardList.split(",") : [];
  
        if (cardList.length === 0) {
          winnerName = player.playerName || player.playerID;
          winnerID = player.playerID;
          break;
        }
      }
  
      if (winnerID) {
        await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/setMoney.php?action=setMoney&playerID=${winnerID}&money=${moneyToSet}`);
      }
  
    } catch (err) {
      setError("Failed to fetch winner info");
    }
  };

  const handleCardPlay = async (card) => {
    const cleanedCard = card.replace(/[^a-zA-Z0-9_]/g, "")

    // Handle wild cards
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
        await fetchGameState()
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
    setSelectedColor(color)

    // Map color selection to the appropriate wild card code
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
        await fetchGameState()
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
      const result = await drawCard(gameID, playerID)

      if (result.success) {
        const newCard = (result.new_card.charAt(0).toUpperCase() + result.new_card.slice(1)).replace("_", " ")
        setGameMessage(`Drew a card: ${newCard}`)
        await fetchGameState()
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
        await fetchGameState()
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
      className: "w-16 h-24 sm:w-20 sm:h-28",
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
    const rotatedPlayers = [
      ...gameState.players.slice(playerIndex),
      ...gameState.players.slice(0, playerIndex),
    ].reverse()

    const otherPlayers = rotatedPlayers.slice(1)
    const totalPlayers = otherPlayers.length

    if (totalPlayers === 0) return null

    return (
      <div className="relative w-full h-full">
        {otherPlayers.map((player, index) => {
          // Calculate position based on total players and current index
          let positionClass = ""

          if (totalPlayers <= 2) {
            positionClass = index === 0 ? "left-0" : "right-0"
          } else if (totalPlayers === 3) {
            if (index === 0) positionClass = "left-0"
            else if (index === 1) positionClass = "top-0 left-1/2 -translate-x-1/2"
            else positionClass = "right-0"
          } else if (totalPlayers === 4) {
            if (index === 0) positionClass = "left-0 top-1/4"
            else if (index === 1) positionClass = "left-1/4 top-0"
            else if (index === 2) positionClass = "right-1/4 top-0"
            else positionClass = "right-0 top-1/4"
          } else {
            if (index === 0) positionClass = "left-0 top-1/3"
            else if (index === 1) positionClass = "left-1/5 top-0"
            else if (index === 2) positionClass = "top-0 left-1/2 -translate-x-1/2"
            else if (index === 3) positionClass = "right-1/5 top-0"
            else positionClass = "right-0 top-1/3"
          }

          const isCurrentTurn = gameState.currentPlayer === player.playerID

          return (
            <div key={player.playerID} className={`absolute ${positionClass} transform p-2`}>
              <div
                className={`flex flex-col items-center p-3 rounded-lg ${
                  isCurrentTurn ? "bg-yellow-100 ring-2 ring-yellow-400" : "bg-gray-800 bg-opacity-70"
                }`}
              >
                <div className={`font-bold mb-1 text-sm ${isCurrentTurn ? "text-yellow-800" : "text-white"}`}>
                  {player.playerName || `Player ${index + 1}`}
                </div>
                <div className="flex">
                  {Array(Math.min(player.cardCount || 0, 7))
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="transform -ml-6 first:ml-0" style={{ zIndex: 10 - i }}>
                        <CardBack className="w-10 h-14" isDark={!isCurrentTurn} onClick={undefined} />
                      </div>
                    ))}
                  {player.cardCount > 7 && (
                    <div className="ml-1 flex items-center justify-center text-white text-xs">
                      +{player.cardCount - 7}
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
  //   <div className="flex flex-col h-screen bg-[#3e8914] p-4 overflow-hidden">
  //     {/* Game header with info */}
  //     <div className="flex justify-between items-center mb-2">
  //       <div className="text-white">
  //         <h2 className="text-lg font-bold">UNO Game</h2>
  //         <p className="text-sm">Game ID: {gameID}</p>
  //       </div>
  //       <div className="flex items-center gap-2">
  //         <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
  //           <Users className="w-4 h-4 mr-1" />
  //           <span>{gameState?.players?.length || 0} players</span>
  //         </div>
  //         {gameState?.bettingAmount > 0 && (
  //           <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex flex-col items-center">
  //             <div className="flex items-center">
  //               <DollarSign className="w-4 h-4 mr-1" />
  //               <span>{gameState.bettingAmount}</span>
  //             </div>
  //             <div className="flex items-center">
  //               <Trophy className="w-4 h-4 mr-1" />
  //               <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Notifications */}
  //     {error && (
  //       <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg flex items-center">
  //         <AlertCircle className="w-5 h-5 mr-2" />
  //         <span>{error}</span>
  //         <button className="ml-4" onClick={() => setError("")}>
  //           <X className="w-5 h-5" />
  //         </button>
  //       </div>
  //     )}

  //     {gameMessage && (
  //       <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center">
  //         <CheckCircle2 className="w-5 h-5 mr-2" />
  //         <span>{gameMessage}</span>
  //         <button className="ml-4" onClick={() => setGameMessage("")}>
  //           <X className="w-5 h-5" />
  //         </button>
  //       </div>
  //     )}

  //     {/* Waiting room */}
  //     {gameState?.gameStatus === "waiting" && (
  //       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
  //         <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
  //           <h2 className="text-2xl font-bold mb-4">Waiting for players...</h2>
  //           <p className="mb-2">
  //             Game Code: <span className="font-mono font-bold">{gameID}</span>
  //           </p>
  //           <p className="mb-4">Players: {gameState?.players?.length || 0}</p>

  //           <div className="grid grid-cols-2 gap-2 mb-6">
  //             {gameState?.players?.map((player, index) => (
  //               <div key={player.playerID} className="bg-gray-100 p-2 rounded">
  //                 {player.playerName || `Player ${index + 1}`}
  //                 {player.playerID === gameState.host && (
  //                   <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">Host</span>
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           {gameState.host === playerID && (
  //             <button
  //               className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
  //               onClick={startGame}
  //             >
  //               Start Game
  //             </button>
  //           )}
  //         </div>
  //       </div>
  //     )}

  //     {/* Game board */}
  //     <div className="flex-1 relative">
  //       {/* Other players positioned around the board */}
  //       {renderOtherPlayers()}

  //       {/* Center play area */}
  //       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex items-center justify-center">
  //         <div className="flex flex-row items-center space-x-8 bg-black bg-opacity-30 p-6 rounded-xl">
  //           {/* Draw pile */}
  //           <div className="text-center">
  //             <CardBack
  //               className="w-20 h-32 sm:w-24 sm:h-36 mb-2 transition-transform hover:scale-105"
  //               isDark={true}
  //               onClick={isPlayerTurn ? handleDrawCard : undefined}
  //             />
  //             <p className="text-white text-sm">Draw Pile</p>
  //           </div>

  //           {/* Current card */}
  //           <div className="text-center">
  //             {gameState?.currentCard ? (
  //               <div className="relative">
  //                 {isColoredWildCard && effectiveColor ? (
  //                   <ColoredWildCard
  //                     color={effectiveColor}
  //                     className="w-16 h-24 sm:w-20 sm:h-28"
  //                     onClick={undefined}
  //                     disabled={!isPlayerTurn}
  //                   />
  //                 ) : isColoredWild5 && effectiveColor ? (
  //                   <ColoredPlusFiveCard
  //                     color={effectiveColor}
  //                     className="w-16 h-24 sm:w-20 sm:h-28"
  //                     onClick={undefined}
  //                     disabled={!isPlayerTurn}
  //                   />
  //                 ) : (
  //                   renderCard(gameState.currentCard)
  //                 )}
  //               </div>
  //             ) : (
  //               <div className="w-20 h-32 sm:w-24 sm:h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
  //                 <span className="text-white/50">No Card</span>
  //               </div>
  //             )}
  //             <p className="text-white text-sm mt-2">Current Card</p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Game status */}
  //       <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
  //         <div
  //           className={`px-4 py-2 rounded-full ${
  //             isPlayerTurn ? "bg-yellow-400 text-yellow-900" : "bg-white/10 text-white"
  //           }`}
  //         >
  //           {isPlayerTurn
  //             ? "Your Turn!"
  //             : `Waiting for ${gameState?.players.find((p) => p.playerID === gameState?.currentPlayer)?.playerName || "opponent"}'s turn`}
  //         </div>
  //       </div>
  //     </div>

  //     {/* Player's hand */}
  //     <div className="mt-auto pt-4 pb-2">
  //       <div className="flex justify-between items-center mb-2">
  //         <h3 className="text-white text-lg font-bold">Your Hand ({currentPlayerName})</h3>
  //         <div className="text-white text-sm">{playerHand.length} cards</div>
  //       </div>

  //       <div className="flex justify-center overflow-x-auto pb-4 px-4">
  //         <div className="flex">
  //           {playerHand.map((card, index) => (
  //             <div
  //               key={index}
  //               className={`transform transition-all duration-200 -ml-8 first:ml-0 ${
  //                 isPlayerTurn ? "hover:-translate-y-8" : ""
  //               }`}
  //               style={{ zIndex: index + 1 }}
  //             >
  //               {renderCard(card, index, isPlayerTurn)}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>

  //     {/* Color picker dialog */}
  //     {showColorPicker && (
  //       <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
  //         <div className="bg-white rounded-lg p-6 max-w-sm w-full">
  //           <h3 className="text-xl font-bold mb-4 text-center">Choose a color</h3>
  //           <div className="grid grid-cols-2 gap-4">
  //             <button
  //               className="bg-red-500 hover:bg-red-600 h-24 rounded-lg transition-colors"
  //               onClick={() => handleColorSelect("red")}
  //             />
  //             <button
  //               className="bg-blue-500 hover:bg-blue-600 h-24 rounded-lg transition-colors"
  //               onClick={() => handleColorSelect("blue")}
  //             />
  //             <button
  //               className="bg-yellow-500 hover:bg-yellow-600 h-24 rounded-lg transition-colors"
  //               onClick={() => handleColorSelect("yellow")}
  //             />
  //             <button
  //               className="bg-green-500 hover:bg-green-600 h-24 rounded-lg transition-colors"
  //               onClick={() => handleColorSelect("green")}
  //             />
  //           </div>
  //           <button
  //             className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors"
  //             onClick={() => {
  //               setShowColorPicker(false)
  //               setSelectedCard(null)
  //             }}
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )

  <div className="flex flex-col h-screen bg-[#3e8914] from-emerald-900 to-black p-4 overflow-hidden">
  {/* Game header with info */}
  <div className="flex justify-between items-center mb-2">
    <div className="text-white">
      <h2 className="text-lg font-bold">UNO Game</h2>
      <p className="text-sm">Game ID: {gameID}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
        <Users className="w-4 h-4 mr-1" />
        <span>{gameState?.players?.length || 0} players</span>
      </div>
      {gameState?.bettingAmount > 0 && (
        <div className="bg-black flex flex-col bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
            <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>{gameState.bettingAmount}</span>
            </div>

            <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                <span>${(gameState.bettingAmount * gameState?.players?.length).toFixed(2)}</span>
            </div>
        </div>
        
      )}
    </div>
  </div>

  {/* Notifications */}
  {error && (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg flex items-center">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span>{error}</span>
      <button className="ml-4" onClick={() => setError("")}>
        <X className="w-5 h-5" />
      </button>
    </div>
  )}

  {gameMessage && (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center">
      <CheckCircle2 className="w-5 h-5 mr-2" />
      <span>{gameMessage}</span>
      <button className="ml-4" onClick={() => setGameMessage("")}>
        <X className="w-5 h-5" />
      </button>
    </div>
  )}

  {/* Waiting room */}
  {gameState?.gameStatus === "waiting" && (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-40">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Waiting for players...</h2>
        <p className="mb-2">
          Game Code: <span className="font-mono font-bold">{gameID}</span>
        </p>
        <p className="mb-4">Players: {gameState?.players?.length || 0}</p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {gameState?.players?.map((player, index) => (
            <div key={player.playerID} className="bg-gray-100 p-2 rounded">
              {player.playerName || `Player ${index + 1}`}
              {player.playerID === gameState.host && (
                <span className="ml-2 text-xs bg-yellow-200 px-1 rounded">Host</span>
              )}
            </div>
          ))}
        </div>

        {gameState.host === playerID && (
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
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
      <div className="flex flex-row items-center space-x-8 bg-black bg-opacity-30 p-6 rounded-xl">
        {/* Draw pile */}
        <div className="text-center">
          <CardBack
            className="w-20 h-32 sm:w-24 sm:h-36 mb-2 transition-transform hover:scale-105"
            isDark={true}
            onClick={isPlayerTurn ? handleDrawCard : undefined}
          />
          <p className="text-white text-sm">Draw Pile</p>
        </div>

        {/* Current card */}
        <div className="text-center">
              {gameState?.currentCard ? (
                <div className="relative">
                  {isColoredWildCard && effectiveColor ? (
                    <ColoredWildCard
                      color={effectiveColor}
                      className="w-16 h-24 sm:w-20 sm:h-28"
                      onClick={undefined}
                      disabled={!isPlayerTurn}
                    />
                  ) : isColoredWild5 && effectiveColor ? (
                    <ColoredPlusFiveCard
                      color={effectiveColor}
                      className="w-16 h-24 sm:w-20 sm:h-28"
                      onClick={undefined}
                      disabled={!isPlayerTurn}
                    />
                  ) : (
                    renderCard(gameState.currentCard)
                  )}
                </div>
              ) : (
                <div className="w-20 h-32 sm:w-24 sm:h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-white/50">No Card</span>
                </div>
              )}
              <p className="text-white text-sm mt-2">Current Card</p>
            </div>
          </div>
        </div>

    

    {/* Game status */}
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center">
      <div
        className={`px-4 py-2 rounded-full ${
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
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Choose a color</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 h-24 rounded-lg transition-colors"
            onClick={() => handleColorSelect("red")}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 h-24 rounded-lg transition-colors"
            onClick={() => handleColorSelect("blue")}
          />
          <button
            className="bg-yellow-500 hover:bg-yellow-600 h-24 rounded-lg transition-colors"
            onClick={() => handleColorSelect("yellow")}
          />
          <button
            className="bg-green-500 hover:bg-green-600 h-24 rounded-lg transition-colors"
            onClick={() => handleColorSelect("green")}
          />
        </div>
        <button
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors"
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


            