import { set } from "js-cookie";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const HostGameLobby = () => {
  const { gameID } = useParams(); // Read game code from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [bet, setBetAmount] = useState("");
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
    


  const handleStartGame = async () => {
    
    try {
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php", {
        method: "POST",
          headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          gameID: gameID,
          action: "start_game",
          playerID : username
        })
      });
      const result = await response.json();
      
      if (result.success) {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php", {
          method: "POST",
            headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            gameID: gameID,
            action: "get_game_state",
            playerID : username
          })
        });
        const result = await response.json();
        setBetAmount(result.bettingAmount);
        
        const playerID = username;
        navigate(`/game-board/${gameID}/${playerID}`);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Join failed:", error);
      alert("Network error while joining the game.");
    }
  };

  // Fetch players in the lobby (polling every 3 seconds)
  useEffect(() => {
    
    const fetchPlayersInLobby = async () => {
      console.log(gameID);
      try {
        const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getPlayerList.php?action=getPlayerList&gameID=${gameID}`);

        const data = await response.json();

        if (data.status === "success") {
          const players = data.playerList.split(",");
          const updatedPlayers = players.map((id) => ({
            id,
            name: id,
            ready: false, // You can extend to handle actual readiness later
            isHost: id === username,
          }));
          setPlayers(updatedPlayers);
        }
      } catch (error) {
        console.error("Error fetching player list:", error);
        setError("Failed to fetch player list.");
      }
    };

    const interval = setInterval(fetchPlayersInLobby, 3000);
    return () => clearInterval(interval);
  }, [gameID, username]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-500 to-yellow-500 p-4 sm:p-6 relative">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 p-2"
        aria-label="Back"
        onClick={() => navigate("/play")}
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

      {/* Game Code */}
      {gameID && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-md shadow-md text-lg">
          Code: {gameID}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-16">Waiting for Players</h1>


      {/* Bet Amount */}
      <div className="text-center mt-4 text-xl font-semibold">
        Bet Amount: ${bet}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-700 text-center mt-2">{error}</p>}

      {/* Player List */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center w-full max-w-xs sm:w-96 p-3 sm:p-4 bg-white rounded-lg shadow border"
            >
            <span className="text-lg font-semibold">
              {player.name} {player.isHost && "(Host)"}
            </span>
          </div>
        ))}
      </div>

      {/* Start Game Button */}
      <button
        className={"px-4 py-3 text-lg font-semibold rounded-lg shadow-md w-48 mx-auto block mt-12 bg-red-500 text-white"}
        onClick={handleStartGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default HostGameLobby;
