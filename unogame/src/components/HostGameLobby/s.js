/*
const betAmount = Number(localStorage.getItem('bet'));

  const handleStartGame = async () => {
    try {
      const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/startGame.php", {
        method: "POST",
          headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          gameID: gameCode,
          action: "start"
        })
      });
      if(!response.ok){
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const text = await response.text();

      if (!text || text.trim() === ''){
        throw new Error(`Server returned an empty response`);
      }

      const result = JSON.parse(text);
      
      if (result.success) {
        navigate(`/`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Join failed:", error);
      alert("Network error while joining the game.");
    }
  };
*/