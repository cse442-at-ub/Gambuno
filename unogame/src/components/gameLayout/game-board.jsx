import React, { useState, useEffect } from 'react';
import { UnoCard, WildCard, CardBack, ColorPicker } from './cards/cards';
import { getGameState, playCard, drawCard, initializeGame } from './../lib/api';

export default function UnoGameBoard({ gameId, playerId }) {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [error, setError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameMessage, setGameMessage] = useState('');

  // Fetch game state at regular intervals
  useEffect(() => {
    fetchGameState();
    
    const intervalId = setInterval(() => {
      fetchGameState();
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchGameState = async () => {
    try {
      setIsLoading(true);
      const state = await getGameState(gameId, playerId);
      
      if (state.success) {
        setGameState(state);
        
        // Find the current player's data to get their hand
        const currentPlayerData = state.players.find(player => player.playerID === playerId);
        if (currentPlayerData && currentPlayerData.cardList) {
          setPlayerHand(currentPlayerData.cardList.split(','));
        }
      } else {
        setError(state.message || 'Failed to load game state');
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
      setError('Error connecting to the game server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPlay = async (card) => {
    // If card is wild, show color picker
    if (card.startsWith('wild_')) {
      setSelectedCard(card);
      setShowColorPicker(true);
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await playCard(playerId, gameId, card);
      
      if (result.success) {
        setGameMessage(result.message);
        await fetchGameState(); // Refresh game state after playing
      } else {
        setError(result.message || 'Failed to play card');
      }
    } catch (error) {
      console.error('Error playing card:', error);
      setError('Error connecting to the game server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelect = async (color) => {
    if (!selectedCard) return;
    
    // Format the wild card with the selected color
    const playableCard = selectedCard;
    setShowColorPicker(false);
    
    try {
      setIsLoading(true);
      const result = await playCard(playerId, gameId, playableCard);
      
      if (result.success) {
        setGameMessage(result.message);
        await fetchGameState(); // Refresh game state after playing
      } else {
        setError(result.message || 'Failed to play wild card');
      }
    } catch (error) {
      console.error('Error playing wild card:', error);
      setError('Error connecting to the game server');
    } finally {
      setIsLoading(false);
      setSelectedCard(null);
    }
  };

  const handleDrawCard = async () => {
    try {
      setIsLoading(true);
      const result = await drawCard(gameId, playerId);
      
      if (result.success) {
        setGameMessage(`Drew a card: ${result.new_card}`);
        await fetchGameState(); // Refresh game state after drawing
      } else {
        setError(result.message || 'Failed to draw card');
      }
    } catch (error) {
      console.error('Error drawing card:', error);
      setError('Error connecting to the game server');
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    try {
      setIsLoading(true);
      const result = await initializeGame(gameId, playerId);
      
      if (result.success) {
        setGameMessage('Game started!');
        await fetchGameState(); // Refresh game state after starting
      } else {
        setError(result.message || 'Failed to start game');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Error connecting to the game server');
    } finally {
      setIsLoading(false);
    }
  };

  // Render card component based on card string (color_value)
  const renderCard = (card, index, playable = false) => {
    if (!card) return null;
    
    const [color, number] = card.split('_');
    
    if (color === 'wild') {
      return (
        <WildCard
          key={index}
          className="w-16 h-24 sm:w-20 sm:h-28"
          onClick={playable ? () => handleCardPlay(card) : undefined}
          disabled={!playable}
        />
      );
    } else {
      return (
        <UnoCard
          key={index}
          color={color}
          number={number}
          className="w-16 h-24 sm:w-20 sm:h-28"
          onClick={playable ? () => handleCardPlay(card) : undefined}
          disabled={!playable}
        />
      );
    }
  };

  const isPlayerTurn = gameState?.currentPlayer === playerId;

  // Layout for other players based on total number of players
  const renderOtherPlayers = () => {
    if (!gameState || !gameState.players) return null;
    
    const otherPlayers = gameState.players.filter(player => player.playerID !== playerId);
    
    // Center players evenly around the top of the board
    return (
      <div className="flex flex-wrap justify-center">
        {otherPlayers.map((player, index) => (
          <div 
            key={player.playerID} 
            className={`flex flex-col items-center m-2 p-4 rounded-lg ${gameState.currentPlayer === player.playerID ? 'bg-yellow-100' : 'bg-gray-100'}`}
          >
            <div className="font-bold mb-2">{player.playerName || player.playerID}</div>
            <div className="flex">
              {Array(player.cardCount || 0).fill(0).map((_, i) => (
                <div key={i} className="transform -rotate-90 -ml-10 first:ml-0">
                  <CardBack 
                    className="w-12 h-16 sm:w-14 sm:h-20" 
                    isDark={true}
                    onClick={isPlayerTurn ? handleDrawCard : undefined}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm">{player.cardCount || 0} cards</div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading && !gameState) {
    return <div className="flex items-center justify-center h-screen">Loading game...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-black p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right" 
            onClick={() => setError('')}
          >
            &times;
          </button>
        </div>
      )}
      
      {gameMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {gameMessage}
          <button 
            className="float-right" 
            onClick={() => setGameMessage('')}
          >
            &times;
          </button>
        </div>
      )}
      
      {gameState?.gameStatus === 'waiting' && gameState.host === playerId && (
        <div className="text-center mb-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameState?.gameStatus === 'waiting' && (
        <div className="text-center mb-4 text-white">
          <h2 className="text-xl font-bold">Waiting for players...</h2>
          <p>Game Code: {gameId}</p>
          <p>Players: {gameState?.players?.length || 0}</p>
        </div>
      )}

      {/* Other players */}
      <div className="mb-8">
        {renderOtherPlayers()}
      </div>
      
      {/* Center play area */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex flex-row items-center space-x-8">
          {/* Draw pile */}
          <div className="text-center">
            <CardBack 
              className="w-20 h-32 sm:w-24 sm:h-36 mb-2" 
              isDark={true} 
              onClick={isPlayerTurn ? handleDrawCard : undefined}
            />
            <p className="text-white text-sm">Draw</p>
          </div>
          
          {/* Current card */}
          <div className="text-center">
            {gameState?.currentCard && renderCard(gameState.currentCard)}
            <p className="text-white text-sm mt-2">Current Card</p>
          </div>
        </div>
      </div>
      
      {/* Game info */}
      <div className="text-center mb-4 text-white">
        <h3 className="text-lg font-bold">
          {isPlayerTurn ? "Your Turn!" : `Waiting for ${gameState?.currentPlayer}'s turn`}
        </h3>
        <p>Betting Amount: ${gameState?.bettingAmount || 0}</p>
      </div>
      
      {/* Player's hand */}
      <div className="mt-auto">
        <h3 className="text-white text-lg font-bold mb-2 text-center">Your Hand</h3>
        <div className="flex flex-wrap justify-center">
          {playerHand.map((card, index) => (
            <div key={index} className="transform hover:-translate-y-4 transition-transform duration-200 mx-1">
              {renderCard(card, index, isPlayerTurn)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Color picker dialog */}
      {showColorPicker && (
        <ColorPicker 
          onSelectColor={handleColorSelect} 
          onClose={() => {
            setShowColorPicker(false);
            setSelectedCard(null);
          }} 
        />
      )}
    </div>
  );
}