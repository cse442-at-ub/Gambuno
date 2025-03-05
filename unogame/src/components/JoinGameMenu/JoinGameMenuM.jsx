import React from "react";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
  const navigate = useNavigate();
  const gameRooms = [
    { host: "Player 2", mode: "Hard", cap: "3/6" },
    { host: "Player 1", mode: "Easy", cap: "3/6" },
    { host: "Player 4", mode: "Hard", cap: "3/6" },
    { host: "Player 5", mode: "Normal", cap: "3/6" },
    { host: "Player 3", mode: "Easy", cap: "3/6" },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back"
      onClick={() => navigate("/play")}>
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
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-8 text-center">
        Join a Game
      </h1>
      
      {/* Game Room List */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {gameRooms.map((room, index) => (
          <div key={index} className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3">
            <div>
              <p className="italic">Host - {room.host}</p>
              <p>Game Mode - {room.mode}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Cap</p>
              <p>{room.cap}</p>
            </div>
            <button className="px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
            onClick={() => navigate("/waiting-host")}>
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinGame;
