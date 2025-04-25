/**
 * UNO Game API Service
 * Handles all communication with the backend PHP game logic
 */

const API_PATH = "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php";

/**
 * Initialize a new game with the specified number of players
 * @returns {Promise<Object>} - Initial game state
 * @param gameId
 * @param playerId
 */
export async function initializeGame(gameId, playerId) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "action" : "start_game",
                "gameID": gameId.toString(),
                "playerID": playerId.toString(),
                "playerName" : "",
                "card" : "",
                "host" : "",
                "bettingAmount": "",
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
 * @param gameId
 * @param {String} playerId - ID of the player drawing a card
 * @param {Boolean} auto
 * @returns {Promise<Object>} - Updated game state with new card
 */
export async function drawCard(gameId,playerId, auto) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'draw_card',
                "gameID": gameId.toString(),
                "playerID": playerId.toString(),
                "playerName" : "",
                "auto" : auto,
                "card" : "",
                "host" : "",
                "bettingAmount": "",
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
 * @param {String} playerId - ID of the player playing the card
 * @param {String}gameId
 * @param {String} card - Card being played
 * @returns {Promise<Object>} - Updated game state after playing the card
 */
export async function playCard(playerId,gameId, card) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'place_card',
                "gameID": gameId.toString(),
                "playerID": playerId.toString(),
                "playerName" : "",
                "card" : card.toString(),
                "host" : "",
                "bettingAmount": "",
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

export async function getGameState(gameId, playerId) {
    try {
        const response = await fetch(`${API_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_game_state',
                gameID: gameId.toString(),
                playerID: playerId.toString(),
                playerName: "",
                card: "",
                host: "",
                bettingAmount: "",
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching game state:', error);
        throw error;
    }
}



export async function createGame(playerID, bettingAmount) {
    try {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create_game',
                gameID: '', // Server generates it
                playerID: playerID.toString(),
                playerName: '', // Optional
                card: '', // Optional
                host: '', // Optional
                bettingAmount: bettingAmount.toString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}


export async function joinGame(gameId, playerId) {
    try {
        const response = await fetch("https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'join_game',
                gameID: gameId.toString(),
                playerID: playerId.toString(),
                playerName: "",
                card: "",
                host: "",
                bettingAmount: "",
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error joining game:', error);
        throw error;
    }
}
