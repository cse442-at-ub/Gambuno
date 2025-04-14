import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WinningScreen() {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const [winner, setWinner] = useState("Unknown");
  const [playerResults, setPlayerResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWinnerAndMoney = async () => {
      try {
        // Get Player List
        const playerRes = await fetch(
          "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getPlayerList.php?action=getPlayerList&gameID=${gameID}"
        );


        const playerData = await playerRes.json();
        const players =
          typeof playerData.players === "string"
            ? JSON.parse(playerData.players)
            : playerData.players;
/*
        // Get Betting Amount
        const betRes = await fetch(
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getBettingAmount.php?action=getBettingAmount&gameID=${gameID}"
        );
        const betData = await betRes.json();
        const betAmount = betData.betAmount || 0;
        const totalPlayer = players.length;

        let winnerName = "Unknown";
        let winnerID = "";

        // Find Winner
        for (const player of players) {
          const cardRes = await fetch(
            "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/getPlayerCardList.php?action=getPlayerCardList&gameID=${gameID}&playerID=${player.playerID}"
          );
          const cardData = await cardRes.json();
          const cardList = cardData.cardList
            ? cardData.cardList.split(",")
            : [];

          if (cardList.length === 0) {
            winnerName = player.playerName || player.playerID;
            winnerID = player.playerID;
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
      

        setPlayerResults(results);
        */
      } catch (err) {
        setError("Server Error fetching result");
      }
    };

    fetchWinnerAndMoney();
  }, [gameID]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">Game Over</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Winner: {winner}</h2>

        {playerResults.map((p, idx) => (
          <div key={idx} className="mb-2 text-lg">
            {p.playerName} : ${p.originalMoney} {p.operation} = ${p.finalMoney}
          </div>
        ))}

        <button
          className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full"
          onClick={() => navigate("/")}
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}
