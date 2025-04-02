/**
 * UNO Game Service
 * Handles API communication with the PHP backend
 */
const API_BASE_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/game_api.php'; // Update with your server URL

class GameService {
    /**
     * Fetch current game state
     * @param {number} lobbyID - The game lobby ID
     * @param {number} playerID - The player's ID
     * @returns {Promise} - Game state information
     */
    static async fetchGameState(lobbyID, playerID) {
        try {
            const response = await fetch(
                `${API_BASE_URL}?action=fetchGameState&lobbyID=${lobbyID}&playerID=${playerID}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching game state:', error);
            throw error;
        }
    }

    /**
     * Play a card
     * @param {number} lobbyID - The game lobby ID
     * @param {number} playerID - The player's ID
     * @param {string} card - The card to play
     * @param {string} chosenColor - The chosen color for wild cards
     * @returns {Promise} - Result of the card play
     */
    static async playCard(lobbyID, playerID, card, chosenColor = null) {
        try {
            const response = await fetch(`${API_BASE_URL}?action=playCard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lobbyID,
                    playerID,
                    card,
                    chosenColor,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error playing card:', error);
            throw error;
        }
    }

    /**
     * Draw a card from the deck
     * @param {number} lobbyID - The game lobby ID
     * @param {number} playerID - The player's ID
     * @returns {Promise} - Result of the card draw
     */
    static async drawCard(lobbyID, playerID) {
        try {
            const response = await fetch(`${API_BASE_URL}?action=drawCard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lobbyID,
                    playerID,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error drawing card:', error);
            throw error;
        }
    }

    /**
     * Choose a color for a wild card
     * @param {number} lobbyID - The game lobby ID
     * @param {number} playerID - The player's ID
     * @param {string} color - The chosen color
     * @returns {Promise} - Result of the color choice
     */
    static async chooseColor(lobbyID, playerID, color) {
        try {
            const response = await fetch(`${API_BASE_URL}?action=chooseColor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lobbyID,
                    playerID,
                    color,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error choosing color:', error);
            throw error;
        }
    }

    /**
     * Create a test game for development
     * @param {number} numPlayers - Number of test players
     * @returns {Promise} - The created lobby ID
     */
    static async createTestGame(numPlayers = 4) {
        try {
            const response = await fetch(
                `${API_BASE_URL}?action=createTestGame&numPlayers=${numPlayers}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error creating test game:', error);
            throw error;
        }
    }
}

export default GameService;