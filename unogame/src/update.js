// Game state updater
document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const gameID = getGameIDFromURL(); // Function to get game ID from URL
    const playerID = localStorage.getItem('playerID'); // Stored player ID
    const updateInterval = 2000; // Update every 2 seconds

    // Elements
    const gameContainer = document.getElementById('game-container');
    const currentCardElement = document.getElementById('current-card');
    const playerCardsContainer = document.getElementById('player-cards');
    const turnIndicator = document.getElementById('turn-indicator');

    let gameState = null;
    let updateTimer = null;

    // Start the game state updater
    function startGameStateUpdater() {
        // Initial update
        updateGameState();

        // Set interval for continuous updates
        updateTimer = setInterval(updateGameState, updateInterval);
    }

    // Stop the updater
    function stopGameStateUpdater() {
        if (updateTimer)