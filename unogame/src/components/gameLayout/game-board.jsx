"use client"

import React from "react"
import StarIcon from "@mui/icons-material/Star"

export default function GameBoard() {
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
        botRow: {
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "2rem",
        },
        cardBack: {
            width: "3rem",
            height: "4.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            margin: "0.2rem",
        },
        playArea: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4rem",
            marginBottom: "2rem",
        },
        pile: {
            width: "5rem",
            height: "7rem",
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccc",
            fontWeight: "bold",
        },
        playerHandContainer: {
            backgroundColor: "#1f2937",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "2rem",
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
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4" style={styles.container}>
            <h1 className="text-3xl font-bold text-center mb-6" style={styles.title}>
                UNO Game
            </h1>

            <div className="flex flex-col items-center" style={styles.gameContainer}>
                <div className="w-full max-w-4xl" style={styles.gameContent}>

                    {/* Status Bar */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-4 text-center" style={styles.statusBar}>
                        <h2 className="text-xl font-semibold" style={styles.statusText}>
                            Waiting for other players...
                        </h2>
                    </div>

                    {/* Other Players */}
                    <div style={styles.botRow}>
                        {["Player 2", "Player 3", "Player 4"].map((player, idx) => (
                            <div key={idx} className="text-center">
                                <p className="mb-2 font-semibold">{player}</p>
                                <div className="flex justify-center">
                                    {Array(5).fill(0).map((_, i) => (
                                        <div key={i} style={styles.cardBack}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Play Area */}
                    <div style={styles.playArea}>
                        <div style={styles.pile}>Draw Pile</div>
                        <div style={styles.pile}>Played Pile</div>
                    </div>

                    {/* Your Hand */}
                    <div className="bg-gray-800 rounded-lg p-4" style={styles.playerHandContainer}>
                        <h3 className="text-lg font-semibold mb-3" style={styles.playerHandTitle}>
                            Your Hand (0)
                        </h3>
                        <div style={styles.playerCards}>
                            {/* Your cards will be rendered here */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
