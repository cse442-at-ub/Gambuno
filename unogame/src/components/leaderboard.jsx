"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Medal, Award } from "lucide-react"

const Leaderboard = () => {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState("") // "money" or "wins"
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy])

  const fetchLeaderboard = async () => {
    console.log("[DEBUG] Starting fetchLeaderboard")
    console.log(`[DEBUG] Request URL: bet.php?action=leaderboard&sort_by=${sortBy}`)

    try {
      setLoading(true)
      setError(null)

      const startTime = performance.now()
      // Use the full URL path as in the attachment
      const response = await fetch(
        `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/bet.php?action=leaderboard&sort_by=${sortBy}`,
      )

      // Simple headers logging for JSX
      console.log("[DEBUG] Response headers:")
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`)
      })

      const contentType = response.headers.get("content-type")
      console.log("[DEBUG] Content-Type:", contentType)

      const responseText = await response.text()
      console.log("[DEBUG] Raw response:", responseText)

      // Check if response is empty
      if (!responseText || responseText.trim() === "") {
        throw new Error("Empty response received from server")
      }

      let data
      try {
        // The PHP might be directly echoing JSON or returning a wrapped object
        data = JSON.parse(responseText)
        console.log("[DEBUG] Parsed JSON data:", data)
      } catch (e) {
        console.error("[DEBUG] Failed to parse JSON:", e)
        throw new Error(`Invalid JSON: ${responseText.substring(0, 100)}...`)
      }

      console.groupCollapsed("[DEBUG] Complete Response Data")
      console.log("Full response:", data)
      console.groupEnd()

      const endTime = performance.now()
      console.log(`[DEBUG] Request took ${(endTime - startTime).toFixed(2)}ms`)

      // Handle both possible response formats:
      // 1. Direct array from create_leaderboard echo
      // 2. Wrapped object with status and leaderboard properties
      let leaderboardEntries = []

      if (Array.isArray(data)) {
        // Direct array response
        console.log(`[DEBUG] Received ${data.length} leaderboard entries (direct array)`)
        leaderboardEntries = data
      } else if (data.status === "success" && Array.isArray(data.leaderboard)) {
        // Wrapped object response
        console.log(`[DEBUG] Received ${data.leaderboard.length} leaderboard entries (wrapped object)`)
        leaderboardEntries = data.leaderboard
      } else {
        console.error("[DEBUG] Unexpected data format:", data)
        throw new Error("Unexpected data format received from server")
      }

      // Sanitize and normalize the data
      const sanitizedData = leaderboardEntries.map((entry) => ({
        username: entry.username || "Unknown",
        money:
          typeof entry.money === "number"
            ? entry.money
            : typeof entry.money === "string"
              ? Number.parseInt(entry.money, 10)
              : 0,
        wins: entry.wins
      }))

      setLeaderboardData(sanitizedData)
    } catch (err) {
      console.error("[DEBUG] Error in fetchLeaderboard:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      console.log("[DEBUG] Fetch completed")
      setLoading(false)
    }
  }

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

  // Format money with dollar sign and commas
  const formatMoney = (value) => {
    const num = Number(value)
    return isNaN(num) ? "$0" : `$${num.toLocaleString()}`
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
      {!loading && !error && sortBy === 'money' && (
        <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-red-500 text-white p-4 grid grid-cols-12 font-bold text-lg border-b-4 border-orange-700">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 sm:col-span-4">Player</div>
            <div className="col-span-6 sm:col-span-7 text-center">Money</div>
          </div>

          {/* Leaderboard Entries */}
          <div className="max-h-[60vh] overflow-y-auto">
            
            {leaderboardData.length > 0 ? (
              leaderboardData.map((player, index) => (
                <div
                  key={`${player.username}-${index}`}
                  className={`grid grid-cols-12 p-4 ${
                    index % 2 === 0 ? "bg-orange-100" : "bg-white"
                  } border-b border-orange-200 items-center`}
                >
                  <div className="col-span-1 flex justify-center">{getRankIcon(index + 1)}</div>
                  <div className="col-span-5 sm:col-span-4 font-semibold truncate">{player.username}</div>
                  <div className="col-span-6 sm:col-span-7 text-center font-bold text-orange-700">
                    {formatMoney(player.money)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">No leaderboard data available</div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Container */}
      {!loading && !error && sortBy === 'wins' && (
        <div className="w-full max-w-3xl bg-white/90 rounded-xl border-4 border-orange-700 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-red-500 text-white p-4 grid grid-cols-12 font-bold text-lg border-b-4 border-orange-700">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 sm:col-span-4">Player</div>
            <div className="col-span-6 sm:col-span-7 text-center">Wins</div>
          </div>

          {/* Leaderboard Entries */}
          <div className="max-h-[60vh] overflow-y-auto">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((player, index) => (
                <div
                  key={`${player.username}-${index}`}
                  className={`grid grid-cols-12 p-4 ${
                    index % 2 === 0 ? "bg-orange-100" : "bg-white"
                  } border-b border-orange-200 items-center`}
                >
                  <div className="col-span-1 flex justify-center">{getRankIcon(index + 1)}</div>
                  <div className="col-span-5 sm:col-span-4 font-semibold truncate">{player.username}</div>
                  <div className="col-span-6 sm:col-span-7 text-center font-bold text-orange-700">
                    {player.wins}
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