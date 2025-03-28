"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Medal, Award } from "lucide-react"

const Leaderboard = () => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState("money") // "money" or "wins"
    const [leaderboardData, setLeaderboardData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchLeaderboard()
    }, [sortBy])

    const fetchLeaderboard = async () => {
        console.log("[Frontend] Starting fetchLeaderboard");
        console.log(`[Frontend] Request URL: bet.php?action=leaderboard&sort_by=${sortBy}`);

        try {
            setLoading(true);
            setError(null);

            const startTime = performance.now();
            const response = await fetch(`bet.php?action=leaderboard&sort_by=${sortBy}`);
            const endTime = performance.now();

            console.log(`[Frontend] Request completed in ${(endTime - startTime).toFixed(2)}ms`);
            console.log("[Frontend] Response status:", response.status);

            // Check content type
            const contentType = response.headers.get('content-type');
            console.log("[Frontend] Content-Type:", contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error("[Frontend] Non-JSON response:", text.substring(0, 200));
                throw new Error(`Invalid response: ${text.substring(0, 100)}`);
            }

            const data = await response.json();
            console.log("[Frontend] Full response data:", data);

            if (data.debug) {
                console.groupCollapsed("[Backend] Debug Log");
                data.debug.forEach((log, i) => console.log(`${i}. ${log}`));
                console.groupEnd();
            }

            if (data.status === "success") {
                console.log(`[Frontend] Received ${data.leaderboard.length} leaderboard entries`);
                setLeaderboardData(data.leaderboard);
            } else {
                console.error("[Frontend] API error:", data.message);
                throw new Error(data.message || 'Unknown error occurred');
            }
        } catch (err) {
            console.error("[Frontend] Error in fetchLeaderboard:", err);
            setError(err.message || 'An unknown error occurred');
        } finally {
            console.log("[Frontend] Fetch completed");
            setLoading(false);
        }
    };

    // Sort the data based on the selected sorting method
    const sortedData = [...leaderboardData]
        .sort((a, b) => {
            if (sortBy === "money") {
                return b.money - a.money
            } else {
                // If you implement wins sorting, adjust this
                return 0
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
                        sortBy === "money" ? "bg-red-500 text-white border-orange-700" : "bg-white text-black border-black"
                    }`}
                    onClick={() => setSortBy("money")}
                >
                    By Money
                </button>
                <button
                    className={`px-4 py-2 text-lg font-bold shadow-lg rounded-xl border-4 ${
                        sortBy === "wins" ? "bg-red-500 text-white border-orange-700" : "bg-white text-black border-black"
                    }`}
                    onClick={() => setSortBy("wins")}
                    disabled // Disable until wins is implemented
                >
                    By Wins
                </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl p-8 text-center">
                    Loading leaderboard...
                </div>
            )}

            {error && (
                <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl p-8 text-center text-red-500">
                    Error: {error}
                </div>
            )}

            {/* Leaderboard Container */}
            {!loading && !error && (
                <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-red-500 text-white p-4 grid grid-cols-12 font-bold text-lg border-b-4 border-orange-700">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5 sm:col-span-4">Player</div>
                        <div className="col-span-3 text-center">Money</div>
                        <div className="col-span-3 sm:col-span-2 text-center">Wins</div>
                        <div className="hidden sm:block sm:col-span-2 text-center">Games</div>
                    </div>

                    {/* Leaderboard Entries */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {sortedData.length > 0 ? (
                            sortedData.map((player, index) => (
                                <div
                                    key={player.username}
                                    className={`grid grid-cols-12 p-4 ${
                                        index % 2 === 0 ? "bg-orange-100" : "bg-white"
                                    } border-b border-orange-200 items-center`}
                                >
                                    <div className="col-span-1 flex justify-center">{getRankIcon(index + 1)}</div>
                                    <div className="col-span-5 sm:col-span-4 font-semibold truncate">{player.username}</div>
                                    <div className={`col-span-3 text-center font-bold ${sortBy === "money" ? "text-orange-700" : ""}`}>
                                        ${player.money.toLocaleString()}
                                    </div>
                                    <div
                                        className={`col-span-3 sm:col-span-2 text-center font-bold ${sortBy === "wins" ? "text-orange-700" : ""}`}
                                    >
                                        {/* Wins would go here when implemented */}
                                        --
                                    </div>
                                    <div className="hidden sm:block sm:col-span-2 text-center">
                                        {/* Games played would go here when implemented */}
                                        --
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">No leaderboard data available</div>
                        )}
                    </div>
                </div>
            )}

            {/* Refresh Button */}
            <button
                className="mt-6 px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700"
                onClick={fetchLeaderboard}
                disabled={loading}
            >
                {loading ? "Loading..." : "Refresh"}
            </button>
        </div>
    )
}

export default Leaderboard