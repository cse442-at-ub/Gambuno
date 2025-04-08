/**
 * UNO Game API Service
 * Handles all communication with the backend PHP game logic
 */

const API_PATH = "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php";

/**
 * Initialize a new game with the specified number of players
 * @param {number} numPlayers - Number of players in the game
 * @returns {Promise<Object>} - Initial game state
 */
export async function initializeGame(numPlayers) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "action" : "play",
                "gameID": "X1X2X3",
                "playerID": "name1",
                "playerName" :"name1",
                "card" : "card_1",
                "host" : "name1",
                "bettingAmount": 50.00,
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error initializing game:', error);
        throw error;
    }
}

/**
 * Draw a card for the specified player
 * @param {number} playerId - ID of the player drawing a card
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - Updated game state with new card
 */
export async function drawCard(playerId, gameState) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'drawCard',
                playerId,
                gameState
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error drawing card:', error);
        throw error;
    }
}

/**
 * Play a card from a player's hand
 * @param {number} playerId - ID of the player playing the card
 * @param {Object} card - Card being played
 * @param {number} cardIndex - Index of the card in the player's hand
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - Updated game state after playing the card
 */
export async function playCard(playerId, card, cardIndex, gameState) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'playCard',
                playerId,
                card,
                cardIndex,
                gameState
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error playing card:', error);
        throw error;
    }
}

/**
 * Play a wild card with the selected color
 * @param {number} playerId - ID of the player playing the wild card
 * @param {Object} card - Wild card being played
 * @param {number} cardIndex - Index of the card in the player's hand
 * @param {string} selectedColor - Color selected for the wild card
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - Updated game state after playing the wild card
 */
export async function playWildCard(playerId, card, cardIndex, selectedColor, gameState) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'playWildCard',
                playerId,
                card,
                cardIndex,
                selectedColor,
                gameState
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error playing wild card:', error);
        throw error;
    }
}

/**
 * Check if a player has said "UNO"
 * @param {number} playerId - ID of the player saying UNO
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - Updated game state after saying UNO
 */
export async function sayUno(playerId, gameState) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'sayUno',
                playerId,
                gameState
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saying UNO:', error);
        throw error;
    }
}

/**
 * Get AI move for a computer player
 * @param {number} playerId - ID of the AI player
 * @param {Object} gameState - Current game state
 * @returns {Promise<Object>} - Updated game state after AI move
 */
export async function getAIMove(playerId, gameState) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'aiMove',
                playerId,
                gameState
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting AI move:', error);
        throw error;
    }
}

/**
 * Check if a card can be played according to game rules
 * @param {Object} card - Card to check
 * @param {Object} lastCard - Last card played
 * @param {string} currentColor - Current color in play
 * @returns {Promise<boolean>} - Whether the card can be played
 */
export async function checkCardPlayable(card, lastCard, currentColor) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'checkCardPlayable',
                card,
                lastCard,
                currentColor
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        return result.playable;
    } catch (error) {
        console.error('Error checking if card is playable:', error);
        throw error;
    }
}
