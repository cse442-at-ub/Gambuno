import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const HostGameLobby = () => {
  const { gameCode } = useParams(); // Read game code from URL
  const location = useLocation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  // Extract bet amount from navigation state
  const username = localStorage.getItem("username");

  const betAmount = Number(localStorage.getItem('bet'));

  const handleStartGame = async () => {
    try {
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/startGame.php", {
        method: "POST",
          headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          gameID: gameCode,
          action: "start"
        })
      });
      if(!response.ok){
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const text = await response.text();

      if (!text || text.trim() === ''){
        throw new Error(`Server returned an empty response`);
      }

      const result = JSON.parse(text);
      
      if (result.success) {
        navigate(`/`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Join failed:", error);
      alert("Network error while joining the game.");
    }
  };

  // Create the lobby initially (only the host)
  useEffect(() => {
    const createLobby = async () => {
      if (!username || !gameCode) {
        console.error("Missing username or game code");
        return;
      }

      try {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/POST.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameID: gameCode,
            action: "create",
            playerID: username,
            playerName: username,
            bet_amount: betAmount,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("Lobby created!", data);
          setPlayers([
            {
              id: username,
              name: username,
              ready: false,
              isHost: true,
            },
          ]);
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
  }, [gameCode, betAmount, username]);

  // Fetch players in the lobby (polling every 3 seconds)
  useEffect(() => {
    const fetchPlayersInLobby = async () => {
      try {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/POST.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "status",
            gameID: gameCode,
            playerID: username,
          }),
        });

        const data = await response.json();

        if (data.players) {
          const updatedPlayers = Object.entries(data.players).map(([id, info]) => ({
            id,
            name: info.playerName,
            ready: false, // You can extend to handle actual readiness later
            isHost: id === username,
          }));
          setPlayers(updatedPlayers);
        }
      } catch (error) {
        console.error("Error fetching player list:", error);
        setError("Failed to fetch player list.");
      }
    };

    const interval = setInterval(fetchPlayersInLobby, 3000);
    return () => clearInterval(interval);
  }, [gameCode, username]);

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

      {/* Game Code */}
      {gameCode && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-md shadow-md text-lg">
          Code: {gameCode}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mt-16">Waiting for Players</h1>

      {/* Bet Amount */}
      <div className="text-center mt-4 text-xl font-semibold">
        Bet Amount: ${betAmount}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-700 text-center mt-2">{error}</p>}

      {/* Player List */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center w-96 p-4 bg-white rounded-lg shadow-md border"
          >
            <span className="text-lg font-semibold">
              {player.name} {player.isHost && "(Host)"}
            </span>
          </div>
        ))}
      </div>

      {/* Start Game Button */}
      <button
        className={"px-4 py-3 text-lg font-semibold rounded-lg shadow-md w-48 mx-auto block mt-12 bg-red-500 text-white"}
        onClick={handleStartGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default HostGameLobby;