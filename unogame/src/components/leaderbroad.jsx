"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Medal, Award } from "lucide-react"

const Leaderboard = () => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState("points") // "points" or "wins"

    // Updated mock data with clearer distinctions between points and wins leaders
    const leaderboardData = [
        // Points Leaders
        { id: 1, name: "PointsKing", points: 12500, wins: 18, gamesPlayed: 45 },
        { id: 2, name: "PointsQueen", points: 11200, wins: 15, gamesPlayed: 42 },
        { id: 3, name: "PointsAce", points: 10800, wins: 12, gamesPlayed: 38 },
        { id: 4, name: "PointsJack", points: 9700, wins: 10, gamesPlayed: 35 },
        { id: 5, name: "PointsMaster", points: 8900, wins: 8, gamesPlayed: 30 },

        // Balanced Players
        { id: 6, name: "BalancedPro", points: 7500, wins: 25, gamesPlayed: 50 },
        { id: 7, name: "AllRounder", points: 6800, wins: 22, gamesPlayed: 48 },

        // Wins Leaders
        { id: 8, name: "WinsMachine", points: 5200, wins: 45, gamesPlayed: 65 },
        { id: 9, name: "VictoryKing", points: 4800, wins: 42, gamesPlayed: 60 },
        { id: 10, name: "WinQueen", points: 4500, wins: 38, gamesPlayed: 55 },
        { id: 11, name: "WinWizard", points: 4100, wins: 35, gamesPlayed: 52 },
        { id: 12, name: "ChampionPro", points: 3800, wins: 32, gamesPlayed: 48 },
    ]

    // Sort the data based on the selected sorting method
    const sortedData = [...leaderboardData]
        .sort((a, b) => {
            if (sortBy === "points") {
                return b.points - a.points
            } else {
                return b.wins - a.wins
            }
        })
        .slice(0, 10) // Only show top 10

    // Function to render the rank icon
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-400" />
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />
            case 3:
                return <Award className="w-6 h-6 text-amber-700" />
            default:
                return <span className="text-lg font-bold">{rank}</span>
        }
    }

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center relative px-4 overflow-hidden">
            {/* Back Button */}
            <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/")}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>

            {/* Logo */}
            <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
                NEXT GEN <span className="text-red-500">UNO</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-black mt-20 mb-4 text-center">Leaderboard</h1>

            {/* Sort Toggle */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 text-lg font-bold shadow-lg rounded-xl border-4 ${
                        sortBy === "points" ? "bg-red-500 text-white border-orange-700" : "bg-white text-black border-black"
                    }`}
                    onClick={() => setSortBy("points")}
                >
                    By Points
                </button>
                <button
                    className={`px-4 py-2 text-lg font-bold shadow-lg rounded-xl border-4 ${
                        sortBy === "wins" ? "bg-red-500 text-white border-orange-700" : "bg-white text-black border-black"
                    }`}
                    onClick={() => setSortBy("wins")}
                >
                    By Wins
                </button>
            </div>

            {/* Leaderboard Container */}
            <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 text-white p-4 grid grid-cols-12 font-bold text-lg border-b-4 border-orange-700">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5 sm:col-span-4">Player</div>
                    <div className="col-span-3 text-center">Points</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Wins</div>
                    <div className="hidden sm:block sm:col-span-2 text-center">Games</div>
                </div>

                {/* Leaderboard Entries */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {sortedData.map((player, index) => (
                        <div
                            key={player.id}
                            className={`grid grid-cols-12 p-4 ${
                                index % 2 === 0 ? "bg-orange-100" : "bg-white"
                            } border-b border-orange-200 items-center`}
                        >
                            <div className="col-span-1 flex justify-center">{getRankIcon(index + 1)}</div>
                            <div className="col-span-5 sm:col-span-4 font-semibold truncate">{player.name}</div>
                            <div className={`col-span-3 text-center font-bold ${sortBy === "points" ? "text-orange-700" : ""}`}>
                                {player.points.toLocaleString()}
                            </div>
                            <div
                                className={`col-span-3 sm:col-span-2 text-center font-bold ${sortBy === "wins" ? "text-orange-700" : ""}`}
                            >
                                {player.wins}
                            </div>
                            <div className="hidden sm:block sm:col-span-2 text-center">{player.gamesPlayed}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Refresh Button */}
            <button className="mt-6 px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700">
                Refresh
            </button>
        </div>
    )
}

export default Leaderboard

