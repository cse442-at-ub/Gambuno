import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
  const navigate = useNavigate();
  const [gameRooms, setGameRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch game rooms from the database via the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/HTTP.php?fetchRooms=true");
        const data = await response.json();
        setGameRooms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
    // Optionally poll for updated rooms every 3 seconds
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const joinGame = async (room) => {
    // Instead of generating a random playerID, let the server/database assign it.
    try {
      // Send a POST request to register the player in the lobby.
      // The backend should insert a new player record and return the assigned playerID.
      const response = await fetch("/api/POST.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameID: room.gameID,
          // Include any additional player initialization data (e.g., name, initial cardList) if needed.
        }),
      });
      const data = await response.json();

      // Assume the response contains the playerID from the database.
      const playerID = data.playerID;
      localStorage.setItem("gameID", room.gameID);
      localStorage.setItem("playerID", playerID);

      console.log("Joined game with playerID:", playerID);
      navigate("/waiting-host");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 p-2"
        aria-label="Back"
        onClick={() => navigate("/select-game")}
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

      {/* Logo */}
      <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
        <button onClick={() => navigate("/")}>
          NEXT GEN <span className="text-red-500">UNO</span>
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-8 text-center">
        Join a Game
      </h1>

      {/* Game Room List */}
      {loading ? (
        <div className="text-center text-lg">Loading game rooms...</div>
      ) : gameRooms && gameRooms.length > 0 ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {gameRooms.map((room, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3"
            >
              <div>
                <p className="italic">Host - {room.host}</p>
                <p>Game Mode - {room.mode}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Cap</p>
                <p>{room.cap}</p>
              </div>
              <button
                className="px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
                onClick={() => joinGame(room)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg">No available game rooms.</div>
      )}
    </div>
  );
};

export default JoinGame;
