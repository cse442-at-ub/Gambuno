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
          height="65px"
          viewBox="0 0 65 65"
          width="45px"
          fill="transparent"
        >
          <path d="M24.6186 24.75C25.2553 22.9121 26.5121 21.3623 28.1664 20.3751C29.8206 19.3879 31.7656 19.0271 33.6568 19.3565C35.548 19.6858 37.2633 20.6842 38.499 22.1747C39.7347 23.6652 40.411 25.5517 40.4082 27.5C40.4082 33 32.2832 35.75 32.2832 35.75M32.4998 46.75H32.5269M59.5832 33C59.5832 48.1878 47.4575 60.5 32.4998 60.5C17.5421 60.5 5.4165 48.1878 5.4165 33C5.4165 17.8122 17.5421 5.5 32.4998 5.5C47.4575 5.5 59.5832 17.8122 59.5832 33Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      </button>
      {showPopup && <MobilePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default GameSelection;
