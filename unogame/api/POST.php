<?php
// Database connection parameters
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Process request data consistently
$postData = [];

if (php_sapi_name() == 'cli') {
    // For CLI, use arguments
    $_SERVER['REQUEST_METHOD'] = 'POST';
    foreach ($argv as $arg) {
        if (strpos($arg, '=') !== false) {
            list($key, $value) = explode('=', $arg);
            $postData[$key] = $value;
        }
    }
} else {
    // For web requests, parse JSON input
    $rawData = file_get_contents("php://input");
    $decoded = json_decode($rawData, true);
    
    // If JSON decode fails, fall back to $_POST
    if ($decoded !== null) {
        $postData = $decoded;
    } else {
        $postData = $_POST;
    }
}

// POST request to fetch game state
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required data
    if (!isset($postData['gameID'])) {
        echo json_encode(['error' => 'Game ID is required']);
        exit;
    }

    $gameID = $conn->real_escape_string($postData['gameID']);
    $playerID = isset($postData['playerID']) ? $conn->real_escape_string($postData['playerID']) : null;

    // Get game state information
    $gameState = fetchGameState($conn, $gameID, $playerID);
    
    // Check for errors in game state
    if (isset($gameState['error'])) {
        echo json_encode($gameState);
        exit;
    }

    // Handle skipped players
    skipCheck($conn, $gameID, $gameState);

    // Handle card placement if the player is making a move
    if (isset($postData['placedCard']) && $playerID) {
        $placedCard = $conn->real_escape_string($postData['placedCard']);
        $placementResult = handleCardPlacement($conn, $gameID, $playerID, $placedCard, $gameState);
        
        if (isset($placementResult['error'])) {
            echo json_encode($placementResult);
            exit;
        }
    }

    // Get fresh game state after any updates
    $updatedGameState = fetchGameState($conn, $gameID, $playerID);
    echo json_encode($updatedGameState);
    exit;
}

/**
 * Fetch the current game state
 * @return array Game state or error message
 */
function fetchGameState($conn, $gameID, $playerID = null) {
    // Get lobby information
    $lobbyQuery = "SELECT curCard, curPlayer, cardEffect, playerList, gameOrder FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($lobbyQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $lobbyResult = $stmt->get_result();

    if ($lobbyResult->num_rows === 0) {
        return ['error' => 'Game not found'];
    }

    $lobbyData = $lobbyResult->fetch_assoc();

    // Parse player list and game order
    $playerList = json_decode($lobbyData['playerList'], true);
    $gameOrder = json_decode($lobbyData['gameOrder'], true);

    // Get all players' data
    $playersQuery = "SELECT playerID, cardList, placedCard, skipped FROM players WHERE gameID = ?";
    $stmt = $conn->prepare($playersQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $playersResult = $stmt->get_result();

    $players = [];

    while ($player = $playersResult->fetch_assoc()) {
        $pid = $player['playerID'];
        $players[$pid] = [
            'skipped' => (bool)$player['skipped'],
            'placedCard' => $player['placedCard']
        ];

        // Only send the full card list to the requesting player
        $cardList = json_decode($player['cardList'], true);
        if ($cardList === null) {
            $cardList = []; // Ensure we have a valid array
        }
        
        $players[$pid]['cardCount'] = count($cardList);
        if ($pid === $playerID) {
            $players[$pid]['cardList'] = $cardList;
        }
    }

    // Construct the game state
    return [
        'lobby' => [
            'curCard' => $lobbyData['curCard'],
            'curPlayer' => $lobbyData['curPlayer'],
            'cardEffect' => $lobbyData['cardEffect'],
            'playerList' => $playerList,
            'gameOrder' => $gameOrder
        ],
        'players' => $players,
        'yourTurn' => ($playerID && $lobbyData['curPlayer'] === $playerID)
    ];
}

/**
 * Check if it's time to update the turn and handle skipped players
 */
function skipCheck($conn, $gameID, $gameState) {
    if (!isset($gameState['lobby'])) {
        return;
    }

    $curPlayer = $gameState['lobby']['curPlayer'];
    $gameOrder = $gameState['lobby']['gameOrder'];

    // Check if current player is skipped
    if (isset($gameState['players'][$curPlayer]['skipped']) && $gameState['players'][$curPlayer]['skipped']) {
        // Find the next player in the game order
        $currentIndex = array_search($curPlayer, $gameOrder);
        if ($currentIndex === false) {
            return; // Invalid game state
        }
        
        $nextIndex = ($currentIndex + 1) % count($gameOrder);
        $nextPlayer = $gameOrder[$nextIndex];

        // Update current player
        $updateQuery = "UPDATE lobby SET curPlayer = ? WHERE gameID = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("ss", $nextPlayer, $gameID);
        $stmt->execute();

        // Reset skipped status for the player we just skipped
        $resetSkippedQuery = "UPDATE players SET skipped = 0 WHERE gameID = ? AND playerID = ?";
        $stmt = $conn->prepare($resetSkippedQuery);
        $stmt->bind_param("ss", $gameID, $curPlayer);
        $stmt->execute();
    }
}

/**
 * Handle card placement and card effects
 * @return array Operation result
 */
function handleCardPlacement($conn, $gameID, $playerID, $placedCard, $gameState) {
    // Check if it's this player's turn
    if ($gameState['lobby']['curPlayer'] !== $playerID) {
        return ['error' => 'Not your turn'];
    }

    // Check if the player has this card
    if (!isset($gameState['players'][$playerID]['cardList'])) {
        return ['error' => 'Player cards not found'];
    }
    
    $playerCards = $gameState['players'][$playerID]['cardList'];
    $cardIndex = array_search($placedCard, $playerCards);
    
    if ($cardIndex === false) {
        return ['error' => 'Card not in player hand'];
    }

    $curCard = $gameState['lobby']['curCard'];

    // Check if the placed card is valid (same color or same number or wild)
    $placedCardInfo = parseCard($placedCard);
    $curCardInfo = parseCard($curCard);

    $isValid = $placedCardInfo['color'] === $curCardInfo['color'] ||
        $placedCardInfo['value'] === $curCardInfo['value'] ||
        $placedCardInfo['color'] === 'wild';

    if (!$isValid) {
        return ['error' => 'Invalid card placement'];
    }

    // Remove the card from player's hand
    array_splice($playerCards, $cardIndex, 1);
    $updatedCardList = json_encode($playerCards);

    // Update the player's card list and placed card
    $updatePlayerQuery = "UPDATE players SET cardList = ?, placedCard = ? WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($updatePlayerQuery);
    $stmt->bind_param("ssss", $updatedCardList, $placedCard, $gameID, $playerID);
    $stmt->execute();

    // Update the lobby's current card
    $updateLobbyQuery = "UPDATE lobby SET curCard = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateLobbyQuery);
    $stmt->bind_param("ss", $placedCard, $gameID);
    $stmt->execute();

    // Handle card effects (this no longer calls moveToNextPlayer internally)
    handleCardEffect($conn, $gameID, $placedCard, $gameState);

    return ['success' => true];
}

/**
 * Handle card effects (Draw 2, Draw 4, Skip, Reverse)
 */
function handleCardEffect($conn, $gameID, $placedCard, $gameState) {
    $cardEffect = null;

    // Check if the card has an effect
    if (strpos($placedCard, 'Draw2') !== false) {
        $cardEffect = 'Draw2';
    } elseif (strpos($placedCard, 'Draw4') !== false) {
        $cardEffect = 'Draw4';
    } elseif (strpos($placedCard, 'Skip') !== false) {
        $cardEffect = 'Skip';
    } elseif (strpos($placedCard, 'Reverse') !== false) {
        $cardEffect = 'Reverse';
    }

    // Update the card effect in the lobby (even if null)
    $updateEffectQuery = "UPDATE lobby SET cardEffect = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateEffectQuery);
    $stmt->bind_param("ss", $cardEffect, $gameID);
    $stmt->execute();

    if (!$cardEffect) {
        moveToNextPlayer($conn, $gameID, $gameState);
        return;
    }

    $gameOrder = $gameState['lobby']['gameOrder'];
    $currentIndex = array_search($gameState['lobby']['curPlayer'], $gameOrder);
    
    if ($currentIndex === false) {
        moveToNextPlayer($conn, $gameID, $gameState);
        return;
    }
    
    $nextIndex = ($currentIndex + 1) % count($gameOrder);
    $nextPlayer = $gameOrder[$nextIndex];

    // Apply the effect
    switch ($cardEffect) {
        case 'Draw2':
            addCardsToPlayer($conn, $gameID, $nextPlayer, 2);
            break;
        case 'Draw4':
            addCardsToPlayer($conn, $gameID, $nextPlayer, 4);
            break;
        case 'Skip':
            setPlayerSkipped($conn, $gameID, $nextPlayer);
            break;
        case 'Reverse':
            reverseGameOrder($conn, $gameID);
            break;
    }

    moveToNextPlayer($conn, $gameID, $gameState);
}

/**
 * Add random cards to a player's hand
 */
function addCardsToPlayer($conn, $gameID, $playerID, $cardCount) {
    // Get the player's current cards
    $query = "SELECT cardList FROM players WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $gameID, $playerID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return;
    }

    $row = $result->fetch_assoc();
    $cardList = json_decode($row['cardList'], true);
    
    if ($cardList === null) {
        $cardList = []; // Ensure we have a valid array
    }

    // Generate random cards
    $newCards = generateRandomCards($cardCount);
    $updatedCardList = array_merge($cardList, $newCards);

    // Update the player's card list
    $updatedCardListJson = json_encode($updatedCardList);
    $updateQuery = "UPDATE players SET cardList = ? WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("sss", $updatedCardListJson, $gameID, $playerID);
    $stmt->execute();
}

/**
 * Generate random cards for draw effects
 * @return array Array of card strings
 */
function generateRandomCards($count) {
    $colors = ['red', 'blue', 'green', 'yellow'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $cards = [];

    for ($i = 0; $i < $count; $i++) {
        $color = $colors[array_rand($colors)];
        $value = $values[array_rand($values)];
        $cards[] = "{$color}_{$value}";
    }

    return $cards;
}

/**
 * Set a player's skipped status to true
 */
function setPlayerSkipped($conn, $gameID, $playerID) {
    $query = "UPDATE players SET skipped = 1 WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $gameID, $playerID);
    $stmt->execute();
}

/**
 * Reverse the game order
 */
function reverseGameOrder($conn, $gameID) {
    // Get current game order
    $query = "SELECT gameOrder FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return;
    }

    $row = $result->fetch_assoc();
    $gameOrder = json_decode($row['gameOrder'], true);
    
    if (!is_array($gameOrder)) {
        return; // Invalid game order
    }

    // Reverse the order
    $reversedOrder = array_reverse($gameOrder);
    $reversedOrderJson = json_encode($reversedOrder);

    // Update the game order
    $updateQuery = "UPDATE lobby SET gameOrder = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("ss", $reversedOrderJson, $gameID);
    $stmt->execute();
}

/**
 * Move to the next player in the game order
 */
function moveToNextPlayer($conn, $gameID, $gameState) {
    if (!isset($gameState['lobby']['gameOrder']) || !isset($gameState['lobby']['curPlayer'])) {
        return;
    }
    
    $gameOrder = $gameState['lobby']['gameOrder'];
    $currentPlayer = $gameState['lobby']['curPlayer'];
    $currentIndex = array_search($currentPlayer, $gameOrder);

    if ($currentIndex === false || count($gameOrder) === 0) {
        return; // Invalid game state
    }

    $nextIndex = ($currentIndex + 1) % count($gameOrder);
    $nextPlayer = $gameOrder[$nextIndex];

    // Update the current player
    $updateQuery = "UPDATE lobby SET curPlayer = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("ss", $nextPlayer, $gameID);
    $stmt->execute();
}

/**
 * Parse a card string to get color and value
 * @return array Array with color and value keys
 */
function parseCard($cardString) {
    $parts = explode('_', $cardString);

    if (count($parts) !== 2) {
        return ['color' => 'unknown', 'value' => 'unknown'];
    }

    return [
        'color' => $parts[0],
        'value' => $parts[1]
    ];
}

// Close the database connection
$conn->close();
?>