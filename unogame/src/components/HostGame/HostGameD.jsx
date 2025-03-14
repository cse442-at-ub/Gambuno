import React from "react";
import { useNavigate } from "react-router-dom";

const HostGame = () => {
  const navigate = useNavigate();

  // Function to generate a random 6-character game code
  const generateGameCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const handleHostGame = () => {
    const gameCode = generateGameCode(); // Generate game code
    navigate(`/host-game-lobby/${gameCode}`); // Navigate to HostGameLobby with the game code
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/play")}>
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
        NEXT GEN <span className="text-red-500">UNO</span>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black mt-12 mb-8 text-center">
        Host a Game
      </h1>
      
      {/* Player Count */}
      <button className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700 mb-4">
        Player Count
      </button>
      <input 
        type="number" 
        className="w-24 h-12 text-center text-xl border-4 border-black rounded-lg bg-white shadow-md mb-6" 
        placeholder=""
      />
      
      {/* Game Mode Selection */}
      <button className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700 mb-4">
        Game Mode
      </button>
      <div className="flex gap-4 mb-6">
        <button className="px-6 py-3 bg-green-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-black">Easy</button>
        <button className="px-6 py-3 bg-yellow-500 text-black text-xl font-bold shadow-lg rounded-xl border-4 border-black">Normal</button>
        <button className="px-6 py-3 bg-red-700 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-black">Hard</button>
      </div>
      
      {/* Host Game Button */}
      <button
        className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700"
        onClick={handleHostGame}
      >
        Host Game
      </button>
    </div>
  );
};

export default HostGame;
