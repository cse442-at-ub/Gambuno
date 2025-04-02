<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict this in production
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'GameLogic.php'; // Make sure the path to your class file is correct

// Handle preflight OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';
$response = ['success' => false, 'message' => 'Invalid action'];

// Process based on the requested action
switch ($action) {
    case 'fetchGameState':
        $lobbyID = isset($_GET['lobbyID']) ? intval($_GET['lobbyID']) : 0;
        $playerID = isset($_GET['playerID']) ? intval($_GET['playerID']) : 0;

        if ($lobbyID && $playerID) {
            try {
                $game = new GameLogic($lobbyID);
                $gameState = $game->fetchGameState($playerID);
                $response = ['success' => true, 'gameState' => $gameState];
            } catch (Exception $e) {
                $response = ['success' => false, 'message' => $e->getMessage()];
            }
        } else {
            $response = ['success' => false, 'message' => 'Missing lobbyID or playerID'];
        }
        break;

    case 'playCard':
        $data = json_decode(file_get_contents('php://input'), true);
        $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
        $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;
        $card = isset($data['card']) ? $data['card'] : '';
        $chosenColor = isset($data['chosenColor']) ? $data['chosenColor'] : null;

        if ($lobbyID && $playerID && $card) {
            try {
                $game = new GameLogic($lobbyID);
                $result = $game->handleCardPlacement($playerID, $card, $chosenColor);
                $response = $result;
            } catch (Exception $e) {
                $response = ['success' => false, 'message' => $e->getMessage()];
            }
        } else {
            $response = ['success' => false, 'message' => 'Missing required parameters'];
        }
        break;

    case 'drawCard':
        $data = json_decode(file_get_contents('php://input'), true);
        $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
        $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;

        if ($lobbyID && $playerID) {
            try {
                $game = new GameLogic($lobbyID);
                $result = $game->handleCardDraw($playerID);
                $response = $result;
            } catch (Exception $e) {
                $response = ['success' => false, 'message' => $e->getMessage()];
            }
        } else {
            $response = ['success' => false, 'message' => 'Missing required parameters'];
        }
        break;

    case 'chooseColor':
        $data = json_decode(file_get_contents('php://input'), true);
        $lobbyID = isset($data['lobbyID']) ? intval($data['lobbyID']) : 0;
        $playerID = isset($data['playerID']) ? intval($data['playerID']) : 0;
        $color = isset($data['color']) ? $data['color'] : '';

        if ($lobbyID && $playerID && $color) {
            try {
                $game = new GameLogic($lobbyID);
                $result = $game->chooseColor($playerID, $color);
                $response = $result;
            } catch (Exception $e) {
                $response = ['success' => false, 'message' => $e->getMessage()];
            }
        } else {
            $response = ['success' => false, 'message' => 'Missing required parameters'];
        }
        break;

    case 'createTestGame':
        $numPlayers = isset($_GET['numPlayers']) ? intval($_GET['numPlayers']) : 4;

        try {
            $lobbyID = GameLogic::createTestGame($numPlayers);
            $response = ['success' => true, 'lobbyID' => $lobbyID];
        } catch (Exception $e) {
            $response = ['success' => false, 'message' => $e->getMessage()];
        }
        break;

    default:
        $response = ['success' => false, 'message' => 'Unknown action'];
        break;
}

// Return the response as JSON
echo json_encode($response);