"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const JoinGameMenu = () => {
  const navigate = useNavigate()
  const [lobbies, setLobbies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLobbies()
  }, [])

  const fetchLobbies = async () => {
    console.log("[DEBUG] Starting fetchLobbies")
    const requestURL = "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getWaitingLobbies.php?action=getWaitingLobbies"
    console.log(`[DEBUG] Request URL: ${requestURL}`)
    
    try {
      setLoading(true)
      setError(null)
      const startTime = performance.now()
      
      const response = await fetch(requestURL)
      
      console.log("[DEBUG] Response headers:")
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`)
      })
      const contentType = response.headers.get("content-type")
      console.log("[DEBUG] Content-Type:", contentType)
      
      const responseText = await response.text()
      console.log("[DEBUG] Raw response:", responseText)
      
      if (!responseText || responseText.trim() === "") {
        throw new Error("Empty response received from server")
      }
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log("[DEBUG] Parsed JSON data:", data)
      } catch (e) {
        console.error("[DEBUG] Failed to parse JSON:", e)
        throw new Error(`Invalid JSON: ${responseText.substring(0, 100)}...`)
      }
      
      const endTime = performance.now()
      console.log(`[DEBUG] Request took ${(endTime - startTime).toFixed(2)}ms`)
      
      if (data.status === "success" && Array.isArray(data.lobbies)) {
        console.log(`[DEBUG] Received ${data.lobbies.length} lobby entries`)
        setLobbies(data.lobbies)
      } else {
        console.error("[DEBUG] Unexpected data format:", data)
        throw new Error("Unexpected data format received from server")
      }
    } catch (err) {
      console.error("[DEBUG] Error in fetchLobbies:", err)
      setError(err.message || "An unknown error occurred")
      setLobbies([])
    } finally {
      setLoading(false)
      console.log("[DEBUG] Fetch lobbies completed")
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/play")}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      
      {/* Logo */}
      <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
        NEXT GEN <span className="text-red-500">UNO</span>
      </div>
      
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-8 text-center">Join a Game</h1>
      
      {loading ? (
        <p className="text-lg text-black">Loading lobbies...</p>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {lobbies.length === 0 ? (
            <p className="text-black">No available lobbies.</p>
          ) : (
            lobbies.map((lobby, index) => {
              let playerList = [];
              try {
                  playerList = JSON.parse(lobby.playerList || "[]");
              } catch (e) {
                  console.error("Error parsing playerList:", e);
              }
              const playerCount = Array.isArray(playerList) ? playerList.length : 0
              const host = playerCount > 0 ? playerList[0] : "Unknown"
              return (
                <div key={index} className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3">
                  <div>
                    <p className="italic">Host - {host}</p>
                    <p>Lobby ID - {lobby.gameID}</p>
                    <p>Players - {playerCount}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/waiting-host/${lobby.gameID}`)}
                    className="px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
                  >
                    Join
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
      
      {/* Refresh Button */}
      <button
        className="mt-6 px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700"
        onClick={fetchLobbies}
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh"}
      </button>
    </div>
  )
}

export default JoinGameMenu
