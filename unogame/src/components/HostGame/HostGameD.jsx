import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HostGame = () => {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(null);
  const [username, setUsername] = useState("");
  const [gameID, setGameCode] = useState("");
  const [money, setMoney] = useState(null);
  const [cookie, setCookie] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Use useEffect for API calls
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const cookieResponse = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/util.php?action=cookie");
        const cookieResult = await cookieResponse.json();
        
        if (cookieResult.status) {
          console.log("Cookie acquired:", cookieResult.cookie);
          setCookie(cookieResult.cookie);
          
          // Get user metadata with the cookie
          const metaResponse = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getAuthDetails.php?action=getAuth&auth=${cookieResult.cookie}`);
          const metaResult = await metaResponse.json();
          
          if (metaResult.status) {
            setUsername(metaResult.username);
            setMoney(metaResult.money);
            console.log("Username:", metaResult.username, "Money:", metaResult.money);
          } else {
            console.error("Failed to get user metadata:", metaResult);
          }
        } else {
          console.error("Failed to get cookie:", cookieResult);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []); // Empty dependency array means this runs once on component mount

  const handleHostGame = async (user, bet) => {
    // First, validate bet amount
    console.log("Bet amount: ", bet);
    console.log("Username: ", user);
    try {
      const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "create_game",
          bettingAmount: Number(bet),
          playerID: user,
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setGameCode(data.gameID); // Store the generated game code in state
        console.log('Game ID: ', data.gameID); // Log the game ID for debugging
        navigate(`/host-game-lobby/${data.gameID}`); // Navigate to the lobby page with the game ID
      } else {
        setError(data.message);
        console.error('Failed to make game:', data.message);
      }
    } catch (error) {
      console.error('Database error:', error);
  }

};

return (
<div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/select-game")}>
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
      <h1 className="text-2xl sm:text-3xl font-bold text-black mt-30 mb-4 text-center">
        Host A Game
      </h1>

      {/* Betting Amount */}
      <button className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700 mb-4">
                Betting Amount
            </button>
            <input
                type="number"
                min="0"
                step="1"
                className="w-24 h-12 text-center text-xl border-4 border-black rounded-lg bg-white shadow-md mb-6"
                placeholder="$"
                value={betAmount}
                onChange={(e) => {
                    // Only allow positive integers
                    const value = e.target.value
                    if (value === "" || /^\d+$/.test(value)) {
                        setBetAmount(value)
                    }
                }}
                onKeyPress={(e) => {
                    // Allow only number keys
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                    }
                }}
            />
      
      {/* Host Game Button */}
      <button
        className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700"
        onClick={() => handleHostGame(username, betAmount)}
      >
        Host Game
      </button>
      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default HostGame