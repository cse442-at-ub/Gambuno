"use client"

import { useState, useEffect } from "react"
import { UnoCard, CardBack } from "./cards/cards"
import { initializeGame, drawCard, playCard, getGameState } from "../lib/api"

export function GameBoard({ gameId = "1", playerId = 0, numPlayers = 4 }) {
    const [gameState, setGameState] = useState(null)
    const [winner, setWinner] = useState(null)
    const [loading, setLoading] = useState(false)

    // Poll the backend to refresh the game state every 3 seconds
    useEffect(() => {
        let interval
        if (gameState) {
            interval = setInterval(async () => {
                try {
                    const state = await getGameState(gameId, playerId)
                    setGameState(state)
                    // If the backend sends a "winner" field, update the state accordingly.
                    if (state.winner !== undefined && state.winner !== null) {
                        setWinner(state.winner)
                    }
                } catch (error) {
                    console.error("Error fetching game state:", error)
                }
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [gameState, gameId, playerId])

    // Start the game using the API
    const startGame = async () => {
        try {
            setLoading(true)
            const state = await initializeGame(gameId, playerId)
            setGameState(state)
            setLoading(false)
        } catch (error) {
            console.error("Error starting game:", error)
            setLoading(false)
        }
    }

    // When the user clicks the draw pile, call the API to draw a card
    const handleDrawCard = async () => {
        // Only allow drawing if the game state exists, it's the current player's turn, and no one has won
        if (!gameState || gameState.currentPlayer !== playerId || winner !== null) return
        try {
            setLoading(true)
            const state = await drawCard(gameId, playerId)
            setGameState(state)
            setLoading(false)
        } catch (error) {
            console.error("Error drawing card:", error)
            setLoading(false)
        }
    }

    // When a card is clicked in the player's hand, use the API to play the card.
    const handlePlayCard = async (card, index) => {
        if (!gameState || gameState.currentPlayer !== playerId || winner !== null) return
        try {
            setLoading(true)
            const state = await playCard(String(playerId), gameId, card)
            setGameState(state)
            setLoading(false)
        } catch (error) {
            console.error("Error playing card:", error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    // If gameState is null, the game hasn’t started yet.
    if (!gameState) {
        return (
            <div className="flex items-center justify-center h-screen">
                <button onClick={startGame} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                    Start Game
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-green-600 p-4">
            {/* Winner Announcement */}
            {winner !== null && (
                <div className="text-center text-3xl font-bold mb-4">
                    {winner === playerId ? "You win!" : `Player ${winner} wins!`}
                </div>
            )}

            {/* Player’s Hand */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">Your Hand</h2>
                <div className="flex space-x-2">
                    {gameState.players &&
                        gameState.players[0] &&
                        gameState.players[0].map((card, index) => (
                            <div key={card.id} onClick={() => handlePlayCard(card, index)}>
                                <UnoCard
                                    color={card.color}
                                    number={card.value}
                                    className="player-card"
                                    onClick={() => handlePlayCard(card, index)}
                                    disabled={winner !== null || gameState.currentPlayer !== playerId}
                                />
                            </div>
                        ))}
                </div>
            </div>

            {/* Draw Pile */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">Draw Pile</h2>
                <div onClick={handleDrawCard} className="cursor-pointer inline-block">
                    <CardBack className="card-back" onClick={handleDrawCard} />
                </div>
            </div>

            {/* Discard Pile */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">Discard Pile</h2>
                {gameState.discardPile && gameState.discardPile.length > 0 ? (
                    <div>
                        <UnoCard
                            color={gameState.discardPile[gameState.discardPile.length - 1].color}
                            number={gameState.discardPile[gameState.discardPile.length - 1].value}
                            className="discard-card"
                            onClick={() => {}}
                            disabled={true}
                        />
                    </div>
                ) : (
                    <p>No cards in discard pile</p>
                )}
            </div>

            {/* Other Players */}
            <div>
                <h2 className="text-xl font-bold">Other Players</h2>
                <div className="flex space-x-4">
                    {gameState.players &&
                        gameState.players.map((hand, idx) => {
                            // Skip rendering the current player's hand (assumed to be at index 0)
                            if (idx === 0) return null
                            return (
                                <div key={idx} className="text-center">
                                    <p>Player {idx}</p>
                                    <p>Cards: {hand.length}</p>
                                    <CardBack className="inline-block" onClick={() => {}} />
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

