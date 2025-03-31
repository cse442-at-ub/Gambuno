"use client"

import { motion } from "framer-motion"
import { UnoCard } from "./cards/uno-card"
import { WildCard } from "./cards/wild-card"
import { CardBack } from "./cards/card-back"

export function UnoLayout() {
  const {
    playerCards = [],
    opponentCards = [],
    currentCard = null,
    drawPileCount = 0,
    currentColor = "red",
    onPlayCard,
    onDrawCard,
    currentPlayer = 0,
    playerNames = ["You", "Player 2", "Player 3", "Player 4"],
  } = {};
  
  return (
    <div className="min-h-screen bg-[#3E8914] p-4 relative">
      {/* Game header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">UNO Game</h1>
        <button className="px-4 py-2 bg-black text-white rounded-lg font-bold shadow-md hover:bg-gray-800">
          New Game
        </button>
      </div>

      {/* Game board */}
      <div className="flex flex-col items-center justify-between h-[calc(100vh-8rem)]">
        {/* Top player (Player 3) */}
        <div className="w-full">
          <p className="text-white font-bold mb-2 text-center">
            {playerNames[2]} {currentPlayer === 2 ? "(Playing)" : ""}
          </p>
          <div className="flex justify-center">
            {Array.from({ length: opponentCards[2] || 0 }).map((_, index) => (
              <motion.div key={index} className="mx-[-8px]" animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                <CardBack isDark={true} className="" onClick={() => {}} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Middle section with side players and center cards */}
        <div className="flex justify-between items-center w-full my-8">
          {/* Left player (Player 2) */}
          <div>
            <p className="text-white font-bold mb-2 text-center">
              {playerNames[1]} {currentPlayer === 1 ? "(Playing)" : ""}
            </p>
            <div className="flex flex-col">
              {Array.from({ length: opponentCards[1] || 0 }).map((_, index) => (
                <motion.div key={index} className="my-[-8px]" animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                  <CardBack isDark={true} className="" onClick={() => {}} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center area with draw and discard piles */}
          <div className="flex items-center justify-center gap-4">
            {/* Draw pile */}
            <div className="relative">
              <CardBack isDark={true} onClick={onDrawCard} className="cursor-pointer hover:scale-105" />
              <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                {drawPileCount}
              </span>
            </div>

            {/* Current card */}
            <div className="relative">
              {currentCard?.type === "special" ? (
                <WildCard className="wild-card" onClick={() => {}} disabled={false} />
              ) : (
                <UnoCard
                  color={currentCard?.color || "red"}
                  number={currentCard?.value || "0"}
                  className="current-card"
                  onClick={() => {}}
                  disabled={true}
                />
              )}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md text-xs">
                <span
                  className="font-bold"
                  style={{
                    color:
                      currentColor === "red"
                        ? "#F42C04"
                        : currentColor === "blue"
                          ? "#1789FC"
                          : currentColor === "green"
                            ? "#3E8914"
                            : currentColor === "yellow"
                              ? "#FFB30F"
                              : "black",
                  }}
                >
                  Current: {currentColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Right player (Player 4) */}
          <div>
            <p className="text-white font-bold mb-2 text-center">
              {playerNames[3]} {currentPlayer === 3 ? "(Playing)" : ""}
            </p>
            <div className="flex flex-col">
              {Array.from({ length: opponentCards[3] || 0 }).map((_, index) => (
                <motion.div key={index} className="my-[-8px]" animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                  <CardBack isDark={true} className="" onClick={() => {}} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Player's hand */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white font-bold">Your Hand {currentPlayer === 0 ? "(Your Turn)" : ""}</p>
            {playerCards.length === 1 && (
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700">
                Say UNO!
              </button>
            )}
          </div>
          <div className="flex justify-center">
            {playerCards.map((card, index) => (
              <motion.div
                key={card.id || index}
                className="mx-[-8px]"
                animate={{ y: -10 }}
                whileHover={{ y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {card.type === "special" ? (
                  <WildCard className="" onClick={() => onPlayCard(card, index)} disabled={false} />
                ) : (
                  <UnoCard color={card.color} number={card.value} className="" onClick={() => onPlayCard(card, index)} disabled={false} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default UnoLayout;

