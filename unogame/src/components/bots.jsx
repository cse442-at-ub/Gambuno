import React, { useState, useEffect } from 'react';
import "../styles/SingleGame.css";
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [botDecks, setBotDecks] = useState([[], [], []]); // 3 bots (total 4 players including human)
  const [playedPile, setPlayedPile] = useState([]);
  const [currentNumber, setCurrentNumber] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [drawCardPile, setDrawCardPile] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 = human, 1-3 = bots
  const [gameMessage, setGameMessage] = useState("Your turn");

  function refreshPage() { 
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
    // Initialize game
    const shuffledDeck = shuffleDeck([...DECK]);

    // Deal 7 cards to each player (human + 3 bots)
    const playerStartingHand = shuffledDeck.splice(0, 7);
    const bot1StartingHand = shuffledDeck.splice(0, 7);
    const bot2StartingHand = shuffledDeck.splice(0, 7);
    const bot3StartingHand = shuffledDeck.splice(0, 7);

    // Extract 1 card for played pile
    let initialCard = shuffledDeck.shift();
    while (initialCard === "W") {
      shuffledDeck.push(initialCard);
      initialCard = shuffledDeck.shift();
    }

    // Set game state
    setPlayer1Deck(playerStartingHand);
    setBotDecks([bot1StartingHand, bot2StartingHand, bot3StartingHand]);
    setPlayedPile([initialCard]);
    setDrawCardPile(shuffledDeck);

    // Extract color and number from initial card
    setCurrentColor(initialCard[1]);
    setCurrentNumber(initialCard[0]);
    setGameOver(false);
    setCurrentPlayer(0); // Human starts first
  }, []);

  // Bot turn logic
  useEffect(() => {
    if (currentPlayer === 0 || gameOver) return;

    const botTurn = setTimeout(() => {
      const botIndex = currentPlayer - 1;
      const botDeck = [...botDecks[botIndex]];
      
      // Find playable cards
      const playableCards = botDeck.filter(card => {
        const [cardNumber, cardColor] = [card[0], card[1]];
        return card === "W" || cardNumber === currentNumber || cardColor === currentColor;
      });

      if (playableCards.length > 0) {
        // Bot plays a random playable card
        const playedCard = playableCards[Math.floor(Math.random() * playableCards.length)];
        
        // Update game state
        const newBotDecks = [...botDecks];
        newBotDecks[botIndex] = botDeck.filter(card => card !== playedCard);
        setBotDecks(newBotDecks);
        
        // Add to played pile
        setPlayedPile(prev => [playedCard, ...prev]);
        
        // Update current card
        const [playedNumber, playedColor] = [playedCard[0], playedCard[1]];
        setCurrentNumber(playedNumber);
        setCurrentColor(playedColor);
        
        setGameMessage(`Bot ${currentPlayer} played ${playedCard}`);
        
        // Check if bot won
        if (newBotDecks[botIndex].length === 0) {
          setGameOver(true);
          setWinner(`Bot ${currentPlayer}`);
          return;
        }
      } else {
        // Bot draws a card if no playable cards
        if (drawCardPile.length > 0) {
          const newCard = drawCardPile[0];
          const newBotDecks = [...botDecks];
          newBotDecks[botIndex] = [...botDeck, newCard];
          setBotDecks(newBotDecks);
          setDrawCardPile(drawCardPile.slice(1));
          setGameMessage(`Bot ${currentPlayer} drew a card`);
        }
      }
      
      // Move to next player
      setCurrentPlayer((currentPlayer + 1) % 4);
    }, 1500); // 1.5 second delay for bot moves

    return () => clearTimeout(botTurn);
  }, [currentPlayer, gameOver]);

  const onPlayedCard = (playedCard) => {
    if (currentPlayer !== 0 || gameOver) return;
    
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

      setGameMessage(`You played ${playedCard}`);
      
      // Check if the player has won
      if (player1Deck.length - 1 === 0) {
        setGameOver(true);
        setWinner("You");
        return;
      }
      
      // Move to next player (bot)
      setCurrentPlayer(1);
    }
  };

  const drawCard = () => {
    if (currentPlayer !== 0 || gameOver || drawCardPile.length === 0) return;

    // Draw a card and add it to player's deck
    const newCard = drawCardPile[0];
    setPlayer1Deck([...player1Deck, newCard]);
    setDrawCardPile(drawCardPile.slice(1));
    setGameMessage(`You drew a card`);
    
    // Move to next player (bot)
    setCurrentPlayer(1);
  };

  return (
    <div className="game-container">
      <h1 className="title">UNO GAME (4 Players)</h1>

      {gameOver ? (
        <>
          <h2 className="game-over">{winner} won!</h2>
          <div>
            <button className="play-again" onClick={() => refreshPage()}>Play Again</button>
          </div>
        </>
      ) : (
        <>
          <h2 className="game-status">{gameMessage}</h2>
          
          <div className="opponents">
            {botDecks.map((deck, index) => (
              <div key={index} className="bot-info">
                <h3>Bot {index + 1}</h3>
                <div className="bot-cards">
                  {Array(deck.length).fill(0).map((_, i) => (
                    <div key={i} className="card-back"></div>
                  ))}
                </div>
                <p>{deck.length} cards</p>
              </div>
            ))}
          </div>

          <h2 className="indicator">Current Card:</h2>
          <div className={`played-card card ${currentColor}`}>{playedPile[0]}</div>

          <h3 className="indicator">Your Cards ({player1Deck.length}):</h3>
          <div className="player-cards">
            {player1Deck.map((card, index) => (
              <button
                key={index}
                className={`card ${card.includes("W") ? "W" : card[1]}`}
                onClick={() => onPlayedCard(card)}
                disabled={currentPlayer !== 0}
              >
                {card}
              </button>
            ))}
          </div>
          
          <div className="action-buttons">
            <button 
              className="draw-button" 
              onClick={drawCard}
              disabled={currentPlayer !== 0 || gameOver}
            >
              Draw Card
            </button>
            <button className="quit-button" onClick={() => navigate('/')}>Quit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;