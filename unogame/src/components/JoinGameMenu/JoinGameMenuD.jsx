import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinGameMenu = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch available lobbies from the server.
  const fetchLobbies = async () => {
    setLoading(true);
    setError("");
    try {
      const requestURL =
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getWaitingLobbies.php?action=getWaitingLobbies";
      const response = await fetch(requestURL);
      const responseText = await response.text();

      // Ensure we received JSON and not an HTML error page.
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
      console.error("Error fetching lobbies:", err);
      setError(err.message);
      setLobbies([]);
    } finally {
      setLoading(false);
    }
  };

  // Join a lobby by posting to joinLobby.php using the username from localStorage
  const joinLobby = async (gameID) => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("Username not found in localStorage.");
      return;
    }
    try {
      const response = await fetch(
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/joinLobby.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameID: gameID,
            action: "join",
            playerID: username,
            playerName: username,
          }),
        }
      );
      const result = await response.json();
      // Now check the 'success' field as used in HostGameLobbyD.jsx
      if (result.success) {
        navigate(`/waiting-host/${gameID}`);
      } else {
        throw new Error(result.error || "Failed to join lobby");
      }
    } catch (error) {
      console.error("Error joining lobby:", error);
      setError(error.message);
    }
  };
  

  useEffect(() => {
    fetchLobbies();
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" onClick={() => navigate("/play")} aria-label="Back">
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

      {/* Lobby List Area */}
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
              return (
                <div key={index} className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3">
                  <div>
                    <p className="italic">Players - {playerCount}</p>
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
