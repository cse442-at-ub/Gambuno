import React from "react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import MobilePopup from "../../MobilePopup";

const GameSelection = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false)

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back"
      onClick={() => navigate("/")}>    {/* Add navigation to home page later*/}
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
        Select Game Type
        </h1>

      {/* Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button className="w-full py-4 bg-red-500 text-white text-xl sm:text-2xl font-bold shadow-lg rounded-xl border-4 border-orange-700 hover:scale-105 transition"
        onClick={() => navigate("/join-game-menu")}>
          Join Game
        </button>
        <button className="w-full py-4 bg-red-500 text-white text-xl sm:text-2xl font-bold shadow-lg rounded-xl border-4 border-orange-700 hover:scale-105 transition"
        onClick={() => navigate("/host-game")}>
          Host Game
        </button>
      </div>

      {/* Help Button */}
      <button  onClick={() => setShowPopup(true)} className="absolute bottom-4 right-4 p-2" aria-label="Help">
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
      {showPopup && <MobilePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default GameSelection;
