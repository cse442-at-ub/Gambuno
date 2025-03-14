import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const HostGameLobby = () => {
  const { gameCode } = useParams(); // Get game code from URL
  const [players, setPlayers] = useState([]); // Store players

  // Add the host as the first player when the component mounts
  useEffect(() => {
    setPlayers((prevPlayers) => {
      // Only add the host if they are not already in the list
      if (prevPlayers.length === 0) {
        return [{ id: 1, name: "Host", ready: false }];
      }
      return prevPlayers;
    });
  }, []);

  // Function to toggle a player's "Ready" status
  const toggleReady = (id) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, ready: !player.ready } : player
      )
    );
  };

  // Check if all players are ready
  const allReady = players.length > 0 && players.every((p) => p.ready);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-500 to-yellow-500 p-6 relative">
      {/* Display Game Code */}
      <div className="absolute top-4 left-4 px-4 py-2 bg-white rounded-md shadow-md text-lg">
        Code: {gameCode}
      </div>

      {/* Next Gen UNO Button (Top Right) */}
      <button className="absolute top-4 right-4 px-6 py-2 bg-black text-white rounded-full text-lg">
        NEXT GEN <span className="text-red-500">UNO</span>
      </button>

      {/* Lobby Title */}
      <h1 className="text-3xl font-bold text-center mt-16">Waiting for Players</h1>

      {/* Players List */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center w-96 p-4 bg-white rounded-lg shadow-md border"
          >
            <span className="text-lg font-semibold">
              {player.name} {player.name === "Host" && "(Host)"} {/* Mark host */}
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

    {/* Start Game Button (Disabled until all players are ready) */}
      </div>
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
