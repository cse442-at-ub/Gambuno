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

    // Get player statistics if requested
    if (isset($_GET['includeStats']) && $_GET['includeStats'] === 'true') {
        $playerStats = fetchPlayerStats($conn, $gameState['lobby']['playerList']);
        $updatedGameState['playerStats'] = $playerStats;
    }

    echo json_encode($updatedGameState);
}

/**
 * Fetch player statistics (wins and total games)
 */
function fetchPlayerStats($conn, $playerIDs) {
    $stats = [];
    
    foreach ($playerIDs as $playerID) {
        $query = "SELECT wins, total_games FROM player_stats WHERE playerID = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $playerStats = $result->fetch_assoc();
            $stats[$playerID] = $playerStats;
        } else {
            // Player has no stats record yet
            $stats[$playerID] = [
                'wins' => 0,
                'total_games' => 0
            ];
        }
    }
    
    return $stats;
}

/**
 * Fetch the current game state
 */
function fetchGameState($conn, $gameID, $playerID = null) {
    // Get lobby information
    $lobbyQuery = "SELECT curCard, curPlayer, cardEffect, playerList, gameOrder, gameStatus, winner FROM lobby WHERE gameID = ?";
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
    $playersQuery = "SELECT playerID, playerName, cardList, placedCard, skipped FROM players WHERE gameID = ?";
    $stmt = $conn->prepare($playersQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $playersResult = $stmt->get_result();

    $players = [];

    while ($player = $playersResult->fetch_assoc()) {
        $pid = $player['playerID'];
        $players[$pid] = [
            'playerName' => $player['playerName'],
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
            'gameStatus' => $lobbyData['gameStatus'] ?? 'active',
            'winner' => $lobbyData['winner'] ?? null
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
    
    if ($cardIndex === false) {
        return ['error' => 'Card not in hand'];
    }

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
    if (count($playerCards) === 0) {
        // Player has won, call the handleGameEnd function from the POST handler
        handleGameEnd($conn, $gameID, $playerID);
        return [
            'success' => true, 
            'message' => 'Player has won!', 
            'winner' => $playerID,
            'gameOver' => true
        ];
    }

    // Handle card effects
    handleCardEffect($conn, $gameID, $placedCard, $gameState);

    // Move to the next player
    moveToNextPlayer($conn, $gameID, $gameState);

    return ['success' => true];
}

/**
 * Handle game end - update statistics for all players
 * This is the same function as in the POST handler for consistency
 */
function handleGameEnd($conn, $gameID, $winnerID) {
    // First, verify the game exists
    $checkGameQuery = "SELECT playerList FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkGameQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Game not found'];
    }
    
    $gameData = $result->fetch_assoc();
    $playerList = json_decode($gameData['playerList'], true);
    
    // Verify winner is in the player list
    if (!in_array($winnerID, $playerList)) {
        return ['error' => 'Winner is not a player in this game'];
    }
    
    // Update statistics for all players
    foreach ($playerList as $playerID) {
        // Check if player has stats record
        $checkStatsQuery = "SELECT * FROM player_stats WHERE playerID = ?";
        $stmt = $conn->prepare($checkStatsQuery);
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            // Create new stats record
            $createStatsQuery = "INSERT INTO player_stats (playerID, wins, total_games) VALUES (?, ?, 1)";
            $stmt = $conn->prepare($createStatsQuery);
            $wins = ($playerID === $winnerID) ? 1 : 0;
            $stmt->bind_param("si", $playerID, $wins);
            $stmt->execute();
        } else {
            // Update existing stats record
            $updateStatsQuery = "UPDATE player_stats SET 
                                total_games = total_games + 1" . 
                                ($playerID === $winnerID ? ", wins = wins + 1" : "") . 
                                " WHERE playerID = ?";
            $stmt = $conn->prepare($updateStatsQuery);
            $stmt->bind_param("s", $playerID);
            $stmt->execute();
        }
    }
    
    // Update game status to completed
    $updateGameQuery = "UPDATE lobby SET gameStatus = 'completed', winner = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateGameQuery);
    $stmt->bind_param("ss", $winnerID, $gameID);
    $stmt->execute();
    
    return [
        'success' => true, 
        'message' => 'Game ended successfully', 
        'winner' => $winnerID,
        'stats_updated' => true
    ];
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