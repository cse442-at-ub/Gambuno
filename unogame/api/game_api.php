<?php

// Enable error reporting for debugging (Disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log errors to a file (useful for debugging)
function logError($message) {
    error_log("[" . date("Y-m-d H:i:s") . "] ERROR: " . $message . "\n", 3, "error_log.txt");
}

// Set headers for JSON response and CORS policy
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'GameLogic.php'; // Ensure the file path is correct

// Handle preflight OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';
$response = ['success' => false, 'message' => 'Invalid action requested.'];

// Process request based on action
try {
    switch ($action) {
        case 'fetchGameState':
            $lobbyID = isset($_GET['lobbyID']) ? intval($_GET['lobbyID']) : 0;
            $playerID = isset($_GET['playerID']) ? intval($_GET['playerID']) : 0;

            if ($lobbyID <= 0 || $playerID <= 0) {
                throw new Exception('Missing or invalid lobbyID/playerID.');
            }

            $game = new GameLogic($lobbyID);
            $gameState = $game->fetchGameState($playerID);
            $response = ['success' => true, 'gameState' => $gameState];
            break;

        case 'playCard':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Invalid JSON input.');
            }

            $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
            $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;
            $card = isset($data['card']) ? $data['card'] : '';
            $chosenColor = isset($data['chosenColor']) ? $data['chosenColor'] : null;

            if ($lobbyID <= 0 || $playerID <= 0 || empty($card)) {
                throw new Exception('Missing required parameters (lobbyID, playerID, card).');
            }

            $game = new GameLogic($lobbyID);
            $response = $game->handleCardPlacement($playerID, $card, $chosenColor);
            break;

        case 'drawCard':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Invalid JSON input.');
            }

            $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
            $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;

            if ($lobbyID <= 0 || $playerID <= 0) {
                throw new Exception('Missing required parameters (lobbyID, playerID).');
            }

            $game = new GameLogic($lobbyID);
            $response = $game->handleCardDraw($playerID);
            break;

        case 'chooseColor':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                throw new Exception('Invalid JSON input.');
            }

            $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
            $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;
            $color = isset($data['color']) ? $data['color'] : '';

            if ($lobbyID <= 0 || $playerID <= 0 || empty($color)) {
                throw new Exception('Missing required parameters (lobbyID, playerID, color).');
            }

            $game = new GameLogic($lobbyID);
            $response = $game->chooseColor($playerID, $color);
            break;

        case 'createTestGame':
            $numPlayers = isset($_GET['numPlayers']) ? intval($_GET['numPlayers']) : 4;
            if ($numPlayers < 2 || $numPlayers > 10) {
                throw new Exception('Number of players must be between 2 and 10.');
            }

            $lobbyID = GameLogic::createTestGame($numPlayers);
            $response = ['success' => true, 'lobbyID' => $lobbyID];
            break;

        default:
            throw new Exception('Unknown action requested.');
    }
} catch (Exception $e) {
    logError($e->getMessage());
    $response = ['success' => false, 'message' => $e->getMessage()];
}

// Return the response as JSON
echo json_encode($response);
?>
