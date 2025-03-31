import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { gameID } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameID) {
      // Fetch all waiting lobbies using getWaitingLobbies.php
      fetch(
        "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/getWaitingLobbies.php?action=getWaitingLobbies"
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success" && Array.isArray(data.lobbies)) {
            // Find the lobby that matches the gameID from the URL.
            const lobby = data.lobbies.find(
              (l) => l.gameID.trim() === gameID.trim()
            );
            if (lobby) {
              let playerList = [];
              try {
                playerList = JSON.parse(lobby.playerList || "[]");
              } catch (e) {
                console.error("Error parsing playerList:", e);
              }
              setPlayers(playerList);
            } else {
              setPlayers([]);
            }
          } else {
            console.error("Unexpected response format:", data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching players:", error);
          setLoading(false);
        });
    }
  }, [gameID]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-500 to-yellow-500 flex flex-col items-center justify-center relative px-6 overflow-hidden">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 p-2"
        aria-label="Back"
        onClick={() => navigate("/join-game-menu")}
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

      {/* Logo */}
      <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xl font-bold border-4 border-orange-700">
        NEXT GEN <span className="text-red-500">UNO</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-black mt-12 mb-8 text-center">
        Waiting for Players
      </h1>

      {loading ? (
        <p className="text-lg text-black">Loading players...</p>
      ) : (
        <div className="w-full max-w-xs flex flex-col gap-4 mb-6">
          {players.length === 0 ? (
            <p className="text-black">No players in this lobby yet.</p>
          ) : (
            players.map((player, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white px-4 py-3 shadow-lg rounded-xl border-4 border-black"
              >
                <div className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" />
                  </svg>
                  <p className="text-lg font-bold text-black">{player}</p>
                </div>
                <span className="px-4 py-2 text-white font-bold rounded-lg bg-green-500">
                  Ready
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Start Game Button */}
      <button className="px-6 py-3 bg-red-500 text-white text-xl font-bold shadow-lg rounded-xl border-4 border-orange-700">
        Start Game
      </button>

      {/* Bottom Icons */}
      <button className="absolute bottom-4 left-4 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#5f6368"
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.02 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      </button>
      <button className="absolute bottom-4 right-4 p-2" aria-label="Help">
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
    </div>
  );
};

export default WaitingRoom;
