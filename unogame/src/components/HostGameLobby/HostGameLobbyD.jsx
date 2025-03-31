import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const HostGameLobby = () => {
  const { gameCode } = useParams(); // Read game code from URL
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  // Extract bet amount from navigation state
  const betAmount = location.state?.betAmount || 0;

  // Create the lobby once gameCode is available
  useEffect(() => {
    const createLobby = async () => {
      const username = localStorage.getItem("username");

      if (!username || !gameCode) {
        console.error("Missing username or game code");
        return;
      }

      try {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/POST.php", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            gameID: gameCode,
            action: 'create',
            playerID: username,
            playerName: username,
            bet_amount: betAmount
          })
        });

        const data = await response.json();

        if (data.success) {
          console.log("Lobby created!", data);
          setPlayers([{ 
            id: username, 
            name: username, 
            ready: false,
            isHost: true 
          }]);
        } else {
          console.error("Error creating lobby:", data.error);
          alert("Failed to create lobby: " + data.error);
        }
      } catch (error) {
        console.error("Failed to create lobby:", error);
        alert("Network error. Please check your connection.");
      }
    };

    createLobby();
  }, [gameCode, betAmount]);

  // Toggle readiness (local only for now)
  const toggleReady = (id) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, ready: !player.ready } : player
      )
    );
  };

  const allReady = players.length > 0 && players.every((p) => p.ready);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-500 to-yellow-500 p-6 relative">
      {/* Back Button */}
      <button 
        className="absolute top-4 left-4 p-2" 
        aria-label="Back" 
        onClick={() => navigate("/play")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#5f6368"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Display Game Code */}
      {gameCode && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-md shadow-md text-lg">
          Code: {gameCode}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mt-16">Waiting for Players</h1>

      {/* Bet Amount Display */}
      <div className="text-center mt-4 text-xl font-semibold">
        Bet Amount: ${betAmount}
      </div>

      {/* Players List */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center w-96 p-4 bg-white rounded-lg shadow-md border"
          >
            <span className="text-lg font-semibold">
              {player.name} {player.isHost && "(Host)"}
            </span>
            <button
              className={`px-4 py-1 rounded-md font-semibold text-white ${
                player.ready ? "bg-green-500" : "bg-red-500"
              }`}
              onClick={() => toggleReady(player.id)}
            >
              {player.ready ? "Ready" : "Waiting"}
            </button>
          </div>
        ))}
      </div>

      {/* Start Game Button */}
      <button
        className={`px-4 py-3 text-lg font-semibold rounded-lg shadow-md w-48 mx-auto block mt-12 ${
          allReady ? "bg-red-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        disabled={!allReady}
      >
        Start Game
      </button>
    </div>
  );
};

export default HostGameLobby;