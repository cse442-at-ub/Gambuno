import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WaitingRoomHost = () => {
  const navigate = useNavigate();
  const { gameID } = useParams();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [bet, setBetAmount] = useState(null);
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState(null);
  const [cookie, setCookie] = useState("");
  const [status, setStatus] = useState("");
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
    }, []);

  // Fetch players list from the server via POST to POST.php.
  const fetchPlayers = async () => {
    try {
      const response = await fetch(
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/POST.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "status",
            gameID: gameID,
            playerID: username, // if needed on the backend
          }),
        }
      );
      const data = await response.json();
      if (data.players) {
        // Transform the players object into an array.
        const updatedPlayers = Object.entries(data.players).map(([id, info]) => ({
          id,
          name: info.playerName,
          ready: info.ready, // adjust if your API returns a readiness flag
          // include other fields if needed
        }));
        const upPlayerList = [];
        for (let i = 0; i < updatedPlayers.length; i++) {
          if (updatedPlayers[i].name != "") {
            upPlayerList.push(updatedPlayers[i]);
          }
        }
        setPlayers(upPlayerList);
      } else {
        throw new Error("No players data returned.");
      }
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to fetch players.");
    }
  };


  const checkGame = async () => {
    if (!username) return;
    try {
        // Get user metadata with the cookie
        const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/bet.php?action=getStatus&gameID=${gameID}`);
        const data = await response.json();
        
        if (data.success ) {
          if (data.status == "inProgress"){
            const playerID = username;
            setStatus(data.status);
            console.log("PlayerID:", playerID);
            console.log("Status:", data.status);
            navigate(`/game-board/${gameID}/${playerID}`);
          }
        } 
        else {
          console.error("Failed to get game status:", response);
        }
      } 
    catch (error){
      console.error("Error during initialization:", error);
    }
    finally{
      setIsLoading(false);
    }
  };


  // Poll every 3 seconds.
  useEffect(() => {
    if (gameID && username) {
      fetchPlayers();
      checkGame();
      const interval = setInterval(fetchPlayers, 1000);
      const interval1 = setInterval(checkGame, 1000);
  
      return () => {
        clearInterval(interval);
        clearInterval(interval1);
      };
    }
  }, [gameID, username]);
  

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative p-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" onClick={() => navigate("/join-game-menu")}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Logo */}
      <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
        NEXT GEN <span className="text-red-500">UNO</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-4 text-center">
        Waiting Room
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Player List */}
      <div className="flex flex-col gap-4 w-full max-w-md overflow-y-auto scrollbar-hide" style={{ maxHeight: "50vh" }}>
        {players.length === 0 ? (
          <p className="text-lg text-black text-center">No players have joined yet.</p>
        ) : (
          players.map((player) => (
            <div key={player.id} className="flex justify-between items-center bg-white px-4 py-3 shadow-lg rounded-xl border-4 border-black">
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" />
                </svg>
                <p className="text-lg font-bold text-black">{player.name}</p>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Bottom Icons */}
      <button className="absolute bottom-4 left-4 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      </button>
      <button className="absolute bottom-4 right-4 p-2" aria-label="Help">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" />
        </svg>
      </button>
    </div>
  );
};

export default WaitingRoomHost;
