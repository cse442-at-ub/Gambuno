import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HostGame = () => {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(null);
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState(null);
  const [cookie, setCookie] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
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

  const generateGameCode = async () => {
    try {
      const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gamecode.php');
      const data = await response.json();
    
      if (data.success) {
        console.log("Game code generated successfully:", data.message); // Store the generated game code in a variable
        return data.message; // This is the generated game code
        
      } else {
        console.error("Failed to generate game code:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error contacting gamecode.php:", error);
      return null;
    }
  };

  const handleHostGame = async () => {
    // First, validate bet amount
    if (betAmount === "") {
      alert("Please enter a betting amount.")
      return
    }
    if (Number(betAmount) > money) {
      alert("You do not have enough money to bet that amount.")
      return
    }
    let gameCode = await generateGameCode(); // Call the function to generate game code
    // If game code generation fails
    // Calculate new balance
    const newBalance = money - Number(betAmount);
    setMoney(newBalance);

    // Update money in database
    const updateMoneyInDatabase = async (username, money) => {
      try {
        const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/update_money.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            money: parseFloat(money)
          })
        });
    
        const data = await response.json();
    
        if (data.status === 'success') {
          console.log('Money updated successfully');
        } else {
          console.error('Failed to update money:', data.message);
        }
      } catch (error) {
        console.error('Error updating money:', error);
      }
    };
    
    // Get username and update money
    await updateMoneyInDatabase(username, newBalance);
  
    // Navigate to game lobby with game code and bet amount
    navigate(`/host-game-lobby/${gameCode}`, { state: { betAmount } });
  
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
        onClick={handleHostGame}
      >
        Host Game
      </button>
    </div>
  );
};

export default HostGame;