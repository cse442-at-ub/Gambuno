import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Trophy, Home, Users } from 'lucide-react';

export default function WinningScreen() {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const [winner, setWinner] = useState("Unknown");
  const [playerResults, setPlayerResults] = useState([]);
  const [error, setError] = useState("");
  const [isHost, setIsHost] = useState("");
  const [currentPlayerID, setCurrentPlayerID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cookie, setCookie] = useState("");
  const [username, setUsername] = useState("");


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


  useEffect(() => {
    const fetchWinnerAndMoney = async () => {
      try {
        // Get Player List
        const playerRes = await fetch(
          `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getCurrentPlayer.php?action=getCurrentPlayer&gameID=${gameID}`
        );
        const playerData = await playerRes.json();
        console.log(playerData);
        const player =
          typeof playerData.curPlayer === "string"
            ? JSON.parse(playerData.currentPlayer)
            : playerData.currentPlayer;
        console.log(player);

        setCurrentPlayerID(player);

        // Get Host ID to check if current player is host
        const hostRes = await fetch(
          `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getHost.php?action=getHost&gameID=${gameID}`
        );
        const hostData = await hostRes.json();
        setIsHost(hostData.currentPlayer);


        /*
        // Get Betting Amount
        const betRes = await fetch(
        `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getBettingAmount.php?action=getBettingAmount&gameID=${gameID}`
        );
        const betData = await betRes.json();
        const betAmount = betData.betting || 0;
        console.log(betAmount);


        const totalPlayer = playerList.length;
        console.log(totalPlayer);
        */

        let winnerName = "Unknown";
        let winnerID = "Unknown";
/*
        // Find Winner
        for (const player of playerList) {
          const cardRes = await fetch(
            `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getPlayerCardList.php?action=getPlayerCardList&playerID=${player}`
          );
          
          const cardData = await cardRes.json();

          const cardList = cardData.cardList
            ? cardData.cardList.split(",")
            : [];
            console.log(cardList);

          if (cardList.length === 0) {
            console.log(player);
            winnerName = player;
            winnerID = player;
          }
        }

        // Calculate Money Result for All Players
        const results = [];
        for (const player of players) {
          const moneyRes = await fetch(
            "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getMoney.php?action=getMoney&playerID=${player.playerID}"
          );
          const moneyData = await moneyRes.json();
          const originalMoney = parseFloat(moneyData.money) || 0;

          let finalMoney = 0;
          let operation = "";

          if (player.playerID === winnerID) {
            finalMoney = originalMoney + betAmount * totalPlayer;
            operation = `+ ${betAmount * totalPlayer}`;
          } else {
            finalMoney = originalMoney - betAmount;
            operation = `- ${betAmount}`;
          }

          // Update Money
          await fetch(
            "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/setMoney.php?action=setMoney&playerID=${player.playerID}&money=${finalMoney}"
          );

          results.push({
            playerName: player.playerName || player.playerID,
            originalMoney,
            operation,
            finalMoney,
          });
        }
      */

        winnerID = player;
        winnerName = player;

        console.log(winnerID);


        setWinner(winnerName);


      } catch (err) {
        setError("Server Error fetching result");
      }
    };

    fetchWinnerAndMoney();
  }, [gameID]);


  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  const timer = setTimeout(() => {
    setShowConfetti(false);
  }, 8000); // Confetti runs for 8 seconds
  useEffect(() => {
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [timer]);

  return (    
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-900 to-black text-white">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={800} />}

<div className="relative z-10 flex flex-col items-center justify-center max-w-3xl w-full px-4 py-12 text-center">
  <div className="mb-6 animate-bounce">
    <div className="bg-white rounded-full p-5 shadow-xl">
      {/* Trophy icon */}
      <div className="bg-white rounded-full p-5 shadow-xl">
            <Trophy className="h-20 w-20 text-[#25cb78]" />
          </div>
    </div>
  </div>

  <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-md animate-in slide-in-from-top duration-700">
    VICTORY!
  </h1>

  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 mb-8 w-full max-w-md border-2 border-white/30 shadow-2xl">
    <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">{winner}</h2>
    <p className="text-xl md:text-2xl text-white/90 font-medium">is the WINNER!</p>
  </div>

  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
    <button
      onClick={() => {
        if (username == isHost) {
          navigate(`/host-game-lobby/${gameID}`);
        } else {
          navigate(`/waiting-host/${gameID}`);
        }
      }}
      className="flex-1 h-14 text-lg font-bold bg-[#3183ff] hover:bg-[#3183ff]/80 text-white border-2 border-white/30 shadow-lg rounded-md flex items-center justify-center"
    >
      {/* Users icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      Back to Lobby
    </button>

    <button
      onClick={() => {
        navigate("/");
      }}
      className="flex-1 h-14 text-lg font-bold bg-[#25cb78] hover:bg-[#25cb78]/80 text-white border-2 border-white/30 shadow-lg rounded-md flex items-center justify-center"
    >
      {/* Home icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      Home Screen
    </button>
  </div>
</div>
    </div>
  );
}

