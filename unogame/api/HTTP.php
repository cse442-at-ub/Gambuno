<?php

// Database connection parameters
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set the response content type to JSON
header('Content-Type: application/json');

if (php_sapi_name() == 'cli'){
    $_SERVER['REQUEST_METHOD'] = 'GET';
    foreach ($argv as $arg) {
        if (strpos($arg, '=') !== false) {
            list($key, $value) = explode('=', $arg);
            $_GET[$key] = $value;
        }
    }
}

// GET request to fetch game state
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['gameID'])) {
        echo json_encode(['error' => 'Game ID is required']);
        exit;
    }

    $gameID = $conn->real_escape_string($_GET['gameID']);
    $playerID = isset($_GET['playerID']) ? $conn->real_escape_string($_GET['playerID']) : null;

    // Get game state information
    $gameState = fetchGameState($conn, $gameID, $playerID);

    skipCheck($conn, $gameID, $gameState);

    // Handle card placement if the player is making a move
    if (isset($_GET['placedCard']) && $playerID) {
        $placedCard = $conn->real_escape_string($_GET['placedCard']);
        handleCardPlacement($conn, $gameID, $playerID, $placedCard, $gameState);
    }

    // Get fresh game state after any updates
    $updatedGameState = fetchGameState($conn, $gameID, $playerID);

    echo json_encode($updatedGameState);
}

/**
 * Fetch the current game state
 */
function fetchGameState($conn, $gameID, $playerID = null) {
    // Get lobby information
    $lobbyQuery = "SELECT curCard, curPlayer, cardEffect, playerList, gameOrder, gameStatus FROM lobby WHERE gameID = ?";
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
            'gameOrder' => $gameOrder,
            'gameStatus' => $lobbyData['gameStatus'] ?? 'active'
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
            // Log error or handle appropriately
            return;
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
 */
function handleCardPlacement($conn, $gameID, $playerID, $placedCard, $gameState) {
    // Check if it's this player's turn
    if ($gameState['lobby']['curPlayer'] !== $playerID) {
        return ['error' => 'Not your turn'];
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

    // Update the player's card list
    $playerCards = $gameState['players'][$playerID]['cardList'];
    $cardIndex = array_search($placedCard, $playerCards);

    // Remove the card from player's hand
    array_splice($playerCards, $cardIndex, 1);
    $updatedCardList = json_encode($playerCards);

    $updatePlayerQuery = "UPDATE players SET cardList = ?, placedCard = ? WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($updatePlayerQuery);
    $stmt->bind_param("ssss", $updatedCardList, $placedCard, $gameID, $playerID);
    $stmt->execute();

    // Update the lobby's current card
    $updateLobbyQuery = "UPDATE lobby SET curCard = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateLobbyQuery);
    $stmt->bind_param("ss", $placedCard, $gameID);
    $stmt->execute();

    // Check if player has won (no cards left)
    if (empty($playerCards)) {
        handleGameEnd($conn, $gameID, $playerID, $gameState);
        return ['success' => true, 'gameEnded' => true, 'winner' => $playerID];
    }

    // Handle card effects
    handleCardEffect($conn, $gameID, $placedCard, $gameState);

    return ['success' => true];
}

/**
 * Handle game end when a player wins
 */
function handleGameEnd($conn, $gameID, $winnerID, $gameState) {
    // Update game status to completed
    $updateGameStatusQuery = "UPDATE lobby SET gameStatus = 'completed', winner = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateGameStatusQuery);
    $stmt->bind_param("ss", $winnerID, $gameID);
    $stmt->execute();

    // Update statistics for all players
    $playerList = $gameState['lobby']['playerList'];

    foreach ($playerList as $playerID) {
        // Increment total games for all players
        updatePlayerStats($conn, $playerID, 'totalGames', 1);

        // Increment wins for the winner
        if ($playerID === $winnerID) {
            updatePlayerStats($conn, $playerID, 'wins', 1);
        }
    }
}

/**
 * Update player statistics
 */
function updatePlayerStats($conn, $playerID, $statField, $increment) {
    // Check if player stats record exists
    $checkQuery = "SELECT playerID FROM player_stats WHERE playerID = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Create new stats record if it doesn't exist
        $createQuery = "INSERT INTO player_stats (playerID, $statField) VALUES (?, ?)";
        $stmt = $conn->prepare($createQuery);
        $stmt->bind_param("si", $playerID, $increment);
        $stmt->execute();
    } else {
        // Update existing stats record
        $updateQuery = "UPDATE player_stats SET $statField = $statField + ? WHERE playerID = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("is", $increment, $playerID);
        $stmt->execute();
    }
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

    if (!$cardEffect) {
        moveToNextPlayer($conn, $gameID, $gameState);
        return;
    }

    // Update the card effect in the lobby
    $updateEffectQuery = "UPDATE lobby SET cardEffect = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateEffectQuery);
    $stmt->bind_param("ss", $cardEffect, $gameID);
    $stmt->execute();

    $gameOrder = $gameState['lobby']['gameOrder'];
    $currentIndex = array_search($gameState['lobby']['curPlayer'], $gameOrder);
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
    $gameOrder = $gameState['lobby']['gameOrder'];
    $currentPlayer = $gameState['lobby']['curPlayer'];
    $currentIndex = array_search($currentPlayer, $gameOrder);

    if ($currentIndex === false) {
        return;
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


