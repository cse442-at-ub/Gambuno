import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinGameMenu = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch available lobbies
  const fetchLobbies = async () => {
    setLoading(true);
    setError("");
    try {
      const requestURL =
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getWaitingLobbies.php?action=getWaitingLobbies";
      const response = await fetch(requestURL);
      const responseText = await response.text();

      if (responseText.trim().toLowerCase().startsWith("<!doctype html>")) {
        throw new Error("Received HTML instead of JSON. Please check the API endpoint.");
      }

      const data = JSON.parse(responseText);
      if (data.status === "success" && Array.isArray(data.lobbies)) {
        setLobbies(data.lobbies);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error in fetchLobbies:", err);
      setError(err.message);
      setLobbies([]);
    } finally {
      setLoading(false);
    }
  };

  // Join a lobby using POST.php
  const joinLobby = async (gameID) => {
    const username = localStorage.getItem("username");

    if (!username || !gameID) {
      alert("Missing username or game code.");
      return;
    }

    try {
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/POST.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID,
          action: "join",
          playerID: username,
          playerName: username,
        }),
      });

      const result = await response.json();

      if (result.success) {
        navigate(`/waiting-host/${gameID}`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Join failed:", error);
      alert("Network error while joining the game.");
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/select-game")}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Logo */}
      <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
        NEXT GEN <span className="text-red-500">UNO</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-4 text-center">
        Join a Game
      </h1>

      {/* Manual Code Entry */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <input
          type="text"
          className="text-xl p-2 rounded border-2 border-black text-center uppercase"
          placeholder="Enter Game Code"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value.toUpperCase())}
          maxLength={6}
        />
        <button
          onClick={() => {
            if (manualCode.length !== 6) {
              alert("Game code must be 6 characters.");
              return;
            }
            joinLobby(manualCode);
          }}
          className="mt-2 px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
        >
          Join by Code
        </button>
      </div>

      {/* Lobby List */}
      {loading && <p className="text-lg text-black">Loading lobbies...</p>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-4 w-full max-w-xl overflow-y-auto scrollbar-hide" style={{ maxHeight: "40vh" }}>
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
              const playerCount = Array.isArray(playerList) ? playerList.length : 0;
              const host = playerCount > 0 ? playerList[0] : "Unknown";

              return (
                <div key={index} className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3">
                  <div>
                    <p className="italic">Host - {host}</p>
                    <p>Players - {playerCount}</p>
                  </div>
                  <button
                    onClick={() => joinLobby(lobby.gameID)}
                    className="px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
                  >
                    Join
                  </button>
                </div>
              );
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
  );
};

export default JoinGameMenu;