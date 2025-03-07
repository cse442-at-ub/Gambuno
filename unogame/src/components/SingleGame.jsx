import React,{useState, useEffect} from 'react';
import "../styles/SingleGame.css";
import { useNavigate } from 'react-router-dom';

 const Game = () => {
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [playedPile, setPlayedPile] = useState([]);
  const [currentNumber, setCurrentNumber] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [drawCardPile, setDrawCardPile] = useState([]);

  function refreshPage(){ 
    window.location.reload(); 
  }

  const DECK = [
    "0R", "1R", "1R", "2R", "2R", "3R", "3R", "4R", "4R", "5R", "5R", "6R", "6R", "7R", "7R", "8R", "8R", "9R", "9R",
    "0G", "1G", "1G", "2G", "2G", "3G", "3G", "4G", "4G", "5G", "5G", "6G", "6G", "7G", "7G", "8G", "8G", "9G", "9G",
    "0B", "1B", "1B", "2B", "2B", "3B", "3B", "4B", "4B", "5B", "5B", "6B", "6B", "7B", "7B", "8B", "8B", "9B", "9B",
    "0Y", "1Y", "1Y", "2Y", "2Y", "3Y", "3Y", "4Y", "4Y", "5Y", "5Y", "6Y", "6Y", "7Y", "7Y", "8Y", "8Y", "9Y", "9Y",
    "W", "W", "W", "W"
  ];

  // Function to shuffle an array
  const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    // Shuffle deck
    const shuffledDeck = shuffleDeck([...DECK]);

    // Extract 7 cards for player
    const playerStartingHand = shuffledDeck.splice(0, 7);

    // Extract 1 card for played pile
    let initialCard = shuffledDeck.shift();
    while (initialCard === "W") {
      shuffledDeck.push(initialCard);
      initialCard = shuffledDeck.shift();
    }

    // Set game state
    setPlayer1Deck(playerStartingHand);
    setPlayedPile([initialCard]);
    setDrawCardPile(shuffledDeck);

    // Extract color and number from initial card
    setCurrentColor(initialCard[1]);
    setCurrentNumber(initialCard[0]);
    setGameOver(false);
  }, []);

  const onPlayedCard = (playedCard) => {
    
    const [playedNumber, playedColor] = [playedCard[0], playedCard[1]];
    
    const isWildPlayable = playedPile[0][0] === "W";

    // Check if the played card is valid
    if (isWildPlayable || playedNumber === currentNumber || playedColor === currentColor || playedCard === "W") {
      // Remove the played card from the player's deck
      setPlayer1Deck(player1Deck.filter((card) => card !== playedCard));

      // Add card to played pile
      setPlayedPile((prevPile) => [playedCard, ...prevPile]);

      // Update the current card properties
      setCurrentNumber(playedNumber);
      setCurrentColor(playedColor);

      // Check if the player has won
      if (player1Deck.length - 1 === 0) {
        setGameOver(true);
      }
    }
    }


  const drawCard = () => {
    if (drawCardPile.length === 0) return;

    // Draw a card and add it to player's deck
    const newCard = drawCardPile.shift();
    setPlayer1Deck([...player1Deck, newCard]);
    setDrawCardPile([...drawCardPile]);
  };

  return (
    <div className= "game-container">
      <h1 className = "title">UNO GAME</h1>

      {gameOver ? (
        <>
        <h2 className="game-over">You won!</h2>
        <div>
        <button className="play-again" onClick={() => refreshPage()}>Play Again</button>
        </div>
        </>
      ): (
        <>
          <h2 className= "indicator">Current Card:</h2>
          <div className={`played-card card ${currentColor}`}>{playedPile[0]}</div>

          <h3 className= "indicator">Your Cards:</h3>
          <div className="player-cards">
            {player1Deck.map((card, index) => (
              <button
                key={index}
                className = {`card ${card.includes("W") ? "W" : card[1]}`}
                onClick={() => onPlayedCard(card)}
              >
                {card}
              </button>
            ))}
          </div>
          <button className="draw-button" onClick={drawCard}>Draw Card</button>
          <button className="quit-button" onClick={() => navigate('/')}>Quit</button>
          
        </>
      )}
    </div>
  );
  
 };

export default Game;