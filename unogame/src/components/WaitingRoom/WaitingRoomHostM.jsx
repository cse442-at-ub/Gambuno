import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import FriendList from "../FriendList/FriendList";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [showFriendList, setShowFriendList] = useState(true); 


  const players = [
    { name: "Player 1", status: "Ready" },
    { name: "Player 2", status: "Waiting" },
    { name: "Player 3", status: "Waiting" },
    { name: "Player 4", status: "Ready" },
    { name: "Player 5", status: "Ready" },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back"
      onClick={() => navigate("/join-game-menu")}>   
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
        Waiting for Players
      </h1>
      
      {/* Player List */}
      <div className="w-full max-w-xs flex flex-col gap-4 mb-6">
        {players.map((player, index) => (
          <div key={index} className="flex justify-between items-center bg-white px-4 py-3 shadow-lg rounded-xl border-4 border-black">
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <p className="text-lg font-bold text-black">{player.name}</p>
            </div>
            <span className={`px-4 py-2 text-white font-bold rounded-lg ${player.status === "Ready" ? "bg-green-500" : "bg-red-600"}`}>
              {player.status}
            </span>
          </div>
        ))}
      </div>
      
      {/* Start Game Button */}
      <button className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700">
        Start Game
      </button>
      
      {/* Bottom Icons */}

      <button className="absolute bottom-4 right-4 p-2" aria-label="Help">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#5f6368"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" />
        </svg>
      </button>

      {showFriendList && (
  <FriendList 
    onClose={() => setShowFriendList(false)} // Pass close handler
  />
)}
    </div>
  );
};

export default WaitingRoom;
