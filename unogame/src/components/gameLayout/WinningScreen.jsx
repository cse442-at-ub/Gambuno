import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WinningScreen() {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const [winner, setWinner] = useState("Unknown");
  const [bettingRemain, setBettingRemain] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const playerRes = await fetch(
          `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerList.php?action=getPlayerList&gameID=${gameID}`
        );
        const playerData = await playerRes.json();

        if (!playerData.success) {
          setError("Failed to fetch player list");
          return;
        }

        const players = JSON.parse(playerData.players);
        let winnerName = "Unknown";
        let winnerID = "";
        const betAmount = playerData.betAmount || 0;
        const totalPlayer = players.length;
        const moneyToSet = (betAmount * totalPlayer).toFixed(2);

        for (const player of players) {
          const cardRes = await fetch(
            `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getPlayerCardList.php?action=getPlayerCardList&gameID=${gameID}&playerID=${player.playerID}`
          );
          const cardData = await cardRes.json();

          if (cardData.success) {
            const cardList = cardData.cardList ? cardData.cardList.split(",") : [];

            if (cardList.length === 0) {
              winnerName = player.playerName || player.playerID;
              winnerID = player.playerID;
              break;
            }
          }
        }

        if (winnerID) {
          await fetch(
            `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/setMoney.php?action=setMoney&playerID=${winnerID}&money=${moneyToSet}`
          );
        }

      } catch (err) {
        setError("Server Error fetching result");
      }
    };

    fetchWinner();
  }, [gameID]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">Game Over</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Winner: {winner}</h2>
        <p className="text-xl mb-4">Remaining Betting: ${bettingRemain}</p>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full"
          onClick={() => navigate("/")}
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}
