/**
 * UNO Game Service
 * Handles API communication with the PHP backend
 */
const API_BASE_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/gameLogic.php'; // Update with your server URL

// Debug levels
const DEBUG = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4
};

class GameService {

    static debugLevel = DEBUG.DEBUG; // Set default debug level

    /**
     * Configure debugging level
     * @param {number} level - Debug level (0-4)
     */
    static setDebugLevel(level) {
        this.debugLevel = level;
        this.logDebug(`Debug level set to: ${level}`);
    }

    /**
     * Log error messages
     * @param {string} message - Error message
     * @param {*} error - Error object or details
     */
    static logError(message, error) {
        if (this.debugLevel >= DEBUG.ERROR) {
            console.error(`[UNO-ERROR] ${message}`, error);
        }
    }

    /**
     * Log warning messages
     * @param {string} message - Warning message
     * @param {*} data - Optional data to log
     */
    static logWarn(message, data = null) {
        if (this.debugLevel >= DEBUG.WARN) {
            console.warn(`[UNO-WARN] ${message}`, data || '');
        }
    }

    /**
     * Log info messages
     * @param {string} message - Info message
     * @param {*} data - Optional data to log
     */
    static logInfo(message, data = null) {
        if (this.debugLevel >= DEBUG.INFO) {
            console.info(`[UNO-INFO] ${message}`, data || '');
        }
    }

    /**
     * Log debug messages
     * @param {string} message - Debug message
     * @param {*} data - Optional data to log
     */
    static logDebug(message, data = null) {
        if (this.debugLevel >= DEBUG.DEBUG) {
            console.debug(`[UNO-DEBUG] ${message}`, data || '');
        }
    }

    /**
     * Format API request for logging
     * @param {string} action - API action
     * @param {object} params - Request parameters
     * @returns {string} - Formatted request info
     */
    static formatRequestInfo(action, params) {
        return `${action} - Params: ${JSON.stringify(params)}`;
    }

    /**
     * Fetch current game state
     * @param {number} lobbyID - The game lobby ID
     * @param {number} playerID - The player's ID
     * @returns {Promise} - Game state information
     */

    static async fetchGameState(lobbyID, playerID) {
        const action = 'fetchGameState';
        const params = { lobbyID, playerID };

        this.logDebug(`Requesting ${action}`, params);

        try {
            // Fixed the URL format which had an incorrect parameter pattern
            const url = new URL(API_BASE_URL);

            console.log(`Request URL before: ${url.toString()}`);

            // Ensure required parameters are defined
            if (!action) throw new Error("Missing 'action' parameter.");
            if (!lobbyID) throw new Error("Missing 'lobbyID' parameter.");
            if (!playerID) throw new Error("Missing 'playerID' parameter.");

            url.searchParams.append('action', action);
            // console.log(`Request URL action: ${url.toString()}`);

            url.searchParams.append('lobbyID', String(lobbyID)); // Ensure it's a string
            // console.log(`Request URL lobbyID: ${url.toString()}`);

            url.searchParams.append('playerID', String(playerID));
            // console.log(`Request URL playerID: ${url.toString()}`);

            // console.log(`Request URL after: ${url.toString()}`);

            this.logDebug(`Request URL: ${url.toString()}`);
            this.logDebug(`Request URL: ${url}`);

            const startTime = performance.now();
            const response = await fetch(url);
            const endTime = performance.now();

            if (!response.ok) {
                this.logError(`${action} failed with status ${response.status}`, response);
                console.log(`Response status: ${response.status}`);
                console.log(`Response: ${response}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.logInfo(`${action} completed in ${(endTime - startTime).toFixed(2)}ms`);
            this.logDebug(`${action} response:`, data);

            return data;
        } catch (error) {
            this.logError(`${action} failed`, error);
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
        const action = 'playCard';
        const params = { lobbyID, playerID, card, chosenColor };

        this.logDebug(`Requesting ${action}`, params);

        try {
            const startTime = performance.now();
            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const endTime = performance.now();

            if (!response.ok) {
                this.logError(`${action} failed with status ${response.status}`, response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.logInfo(`${action} completed in ${(endTime - startTime).toFixed(2)}ms`);
            this.logDebug(`${action} response:`, data);

            return data;
        } catch (error) {
            this.logError(`${action} failed`, error);
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
        const action = 'drawCard';
        const params = { lobbyID, playerID };

        this.logDebug(`Requesting ${action}`, params);

        try {
            const startTime = performance.now();
            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const endTime = performance.now();

            if (!response.ok) {
                this.logError(`${action} failed with status ${response.status}`, response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.logInfo(`${action} completed in ${(endTime - startTime).toFixed(2)}ms`);
            this.logDebug(`${action} response:`, data);

            return data;
        } catch (error) {
            this.logError(`${action} failed`, error);
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
        const action = 'chooseColor';
        const params = { lobbyID, playerID, color };

        this.logDebug(`Requesting ${action}`, params);

        try {
            const startTime = performance.now();
            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const endTime = performance.now();

            if (!response.ok) {
                this.logError(`${action} failed with status ${response.status}`, response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.logInfo(`${action} completed in ${(endTime - startTime).toFixed(2)}ms`);
            this.logDebug(`${action} response:`, data);

            return data;
        } catch (error) {
            this.logError(`${action} failed`, error);
            throw error;
        }
    }

    /**
     * Create a test game for development
     * @param {number} numPlayers - Number of test players
     * @returns {Promise} - The created lobby ID
     */
    static async createTestGame(numPlayers = 4) {
        const action = 'createTestGame';
        const params = { numPlayers };

        this.logDebug(`Requesting ${action}`, params);

        try {
            const startTime = performance.now();
            const url = `${API_BASE_URL}?action=${action}&numPlayers=${numPlayers}`;
            this.logDebug(`Request URL: ${url}`);

            const response = await fetch(url);
            const endTime = performance.now();

            if (!response.ok) {
                this.logError(`${action} failed with status ${response.status}`, response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.logInfo(`${action} completed in ${(endTime - startTime).toFixed(2)}ms`);
            this.logDebug(`${action} response:`, data);

            return data;
        } catch (error) {
            this.logError(`${action} failed`, error);
            throw error;
        }
    }
}

export default GameService;