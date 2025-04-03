/**
 * game-api.js - Handles communication between React frontend and PHP game logic
 */

const API_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php';

/**
 * Main game API handler
 */
export const GameAPI = {
    /**
     * Create a new game
     * @param {string} playerID
     * @param {number} bettingAmount
     * @returns {Promise<Object>}
     */
    async createGame(playerID, bettingAmount) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_game',
                    playerID,
                    bettingAmount
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Game creation failed: ${error.message}`);
        }
    },

    /**
     * Join an existing game
     * @param {string} gameID
     * @param {string} playerID
     * @returns {Promise<Object>}
     */
    async joinGame(gameID, playerID) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'join_game',
                    gameID,
                    playerID
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Join game failed: ${error.message}`);
        }
    },

    /**
     * Start a game (host only)
     * @param {string} gameID
     * @param {string} playerID
     * @returns {Promise<Object>}
     */
    async startGame(gameID, playerID) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start_game',
                    gameID,
                    playerID
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Game start failed: ${error.message}`);
        }
    },

    /**
     * Play a card
     * @param {string} gameID
     * @param {string} playerID
     * @param {string} card
     * @returns {Promise<Object>}
     */
    async placeCard(gameID, playerID, card) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'place_card',
                    gameID,
                    playerID,
                    card
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Card play failed: ${error.message}`);
        }
    },

    /**
     * Draw a card
     * @param {string} gameID
     * @param {string} playerID
     * @returns {Promise<Object>}
     */
    async drawCard(gameID, playerID) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'draw_card',
                    gameID,
                    playerID
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Card draw failed: ${error.message}`);
        }
    },

    /**
     * Get current game state
     * @param {string} gameID
     * @param {string} playerID
     * @returns {Promise<Object>}
     */
    async getGameState(gameID, playerID) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_game_state',
                    gameID,
                    playerID
                })
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(`Failed to get game state: ${error.message}`);
        }
    }
};

/**
 * Handle API response
 * @param {Response} response
 * @returns {Promise<Object>}
 */
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Unknown error occurred');
    }

    return data;
}

/**
 * Custom hook for game logic integration
 */
export function useGameLogic() {
    return {
        createGame: GameAPI.createGame,
        joinGame: GameAPI.joinGame,
        startGame: GameAPI.startGame,
        placeCard: GameAPI.placeCard,
        drawCard: GameAPI.drawCard,
        getGameState: GameAPI.getGameState
    };
}