import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinGameMenu = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bet, setBetAmount] = useState(null);
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
    }, []);

  const fetchLobbies = async () => {
    setLoading(true);
    setError("");
    try {
      const requestURL =
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getWaitingLobbies.php?action=getWaitingLobbies";
      const response = await fetch(requestURL);
      const responseText = await response.text();

      if (responseText.trim().toLowerCase().startsWith("<!doctype html>")) {
        throw new Error("Received HTML instead of JSON. Please check the API endpoint.");
      }

      const data = JSON.parse(responseText);
      if (data.status === "success" && Array.isArray(data.lobbies)) {
        setLobbies(data.lobbies);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error in fetchLobbies:", err);
      setError(err.message);
      setLobbies([]);
    } finally {
      setLoading(false);
    }
  };

  // Join a lobby using POST.php
  const joinLobby = async (gameID, username) => {
    try {
      const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'join_game',
          gameID: gameID,
          playerID: username,
        })
      });

      const result = await response.json();

      if (result.success) {
        navigate(`/waiting-host/${gameID}`);
        console.log("Joined game successfully:", result);
      
      } 
      else if(result.success === false && result.message === "Already in game") {
        navigate(`/waiting-host/${gameID}`);
        console.log("Joined game successfully:", result);
      }
      else if (result.success === false && result.message === "Game already in progress or finished") {
        // Try to get current game state to decide where to redirect
        const val = username;
        navigate(`/game-board/${gameID}/${val}`);
      }
      else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Join failed:", error);
    }
  };
  useEffect(() => {
    fetchLobbies();
  }, []);


  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button className="absolute top-4 left-4 p-2" aria-label="Back" onClick={() => navigate("/select-game")}>
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
        Join a Game
      </h1>

      {/* Manual Code Entry */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <input
          type="text"
          className="text-xl p-2 rounded border-2 border-black text-center uppercase"
          placeholder="Enter Game Code"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value.toUpperCase())}
          maxLength={6}
        />
        <button
          onClick={() => {
            if (manualCode.length !== 6) {
              alert("Game code must be 6 characters.");
              return;
            }
            joinLobby(manualCode, username);
          }}
          className="mt-2 px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
        >
          Join by Code
        </button>
      </div>

      {/* Lobby List */}
      {loading && <p className="text-lg text-black">Loading lobbies...</p>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-4 w-full max-w-xl overflow-y-auto scrollbar-hide" style={{ maxHeight: "40vh" }}>
          {lobbies.length === 0 ? (
            <p className="text-black">No available lobbies.</p>
          ) : (
            lobbies.map((lobby, index) => {
              let playerList = [];
              try {
                playerList = JSON.parse(lobby.playerList || "[]");
              } catch (e) {
                console.error("Error parsing playerList:", e);
              }
              const playerCount = Array.isArray(playerList) ? playerList.length : 0;
              const host = playerCount > 0 ? playerList[0] : "Unknown";
              const betAmount =  lobby.betting_amt;

              return (
                <div key={index} className="flex justify-between items-center bg-red-500 text-white text-lg font-bold shadow-lg rounded-xl border-4 border-orange-700 px-4 py-3">
                  <div>
                    <p className="italic">Host - {host}</p>
                    <p>Players - {playerCount}</p>
                    <p>Bet Amount - ${betAmount}</p>
                  </div>
                  <button
                    onClick={() => joinLobby(lobby.gameID, username)}
                    className="px-4 py-2 bg-white text-black text-lg font-bold shadow-md rounded-xl border-2 border-gray-400 hover:scale-105 transition"
                  >
                    Join
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Refresh Button */}
      <button
        className="mt-6 px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700"
        onClick={fetchLobbies}
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh"}
      </button>
    </div>
  );
};


export default JoinGameMenu;