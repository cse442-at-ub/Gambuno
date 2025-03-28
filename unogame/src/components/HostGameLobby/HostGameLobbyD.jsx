import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const HostGameLobby = () => {
  const { gameCode } = useParams(); // Get game code from URL
  const [players, setPlayers] = useState([]); // Store players

  // Create the lobby in the backend on mount
  useEffect(() => {
    const createLobby = async () => {
      const username = localStorage.getItem("username"); // retrieves username from LogIn.jsx

      if (!username) {
        console.error("No logged-in user found.");
        return;
      }

      try {
        const response = await fetch("/post.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            gameID: gameCode,
            playerID: username,      
            playerName: username
          })
        });

        const data = await response.json();

        if (data.success) {
          console.log("Lobby created!", data);
          setPlayers([{ id: 1, name: username, ready: false }]);
        } else {
          console.error("Error creating lobby:", data.error);
        }
      } catch (error) {
        console.error("Failed to create lobby:", error);
      }
    };

    createLobby();
  }, [gameCode]);

  // Toggle a player's ready status
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
      {/* Display Game Code */}
      <div className="absolute top-4 left-4 px-4 py-2 bg-white rounded-md shadow-md text-lg">
        Code: {gameCode}
      </div>

      {/* Title Button */}
      <button className="absolute top-4 right-4 px-6 py-2 bg-black text-white rounded-full text-lg">
        NEXT GEN <span className="text-red-500">UNO</span>
      </button>

      {/* Lobby Header */}
      <h1 className="text-3xl font-bold text-center mt-16">Waiting for Players</h1>

      {/* Players List */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center w-96 p-4 bg-white rounded-lg shadow-md border"
          >
            <span className="text-lg font-semibold">
              {player.name} {player.name === "Host" && "(Host)"}
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
