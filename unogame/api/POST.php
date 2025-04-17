<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");
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

// Testing mode - when set to true, will log actions and use test game IDs// Example test game ID

// Log function for testing
function testLog($message) {
    global $testingMode;
    if ($testingMode) {
        error_log("[UNO_TEST] " . $message);
    }
}

// Handle CLI testing if needed
if (php_sapi_name() == 'cli'){
    $_SERVER['REQUEST_METHOD'] = 'POST';
    // Simulate POST data from command line args
    parse_str(file_get_contents('php://stdin'), $_POST);
}

// POST request to update game state
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON input if content type is application/json
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $postData = json_decode(file_get_contents('php://input'), true);
    } else {
        $postData = $_POST;
    }
    
    $gameID = $conn->real_escape_string(trim($postData['gameID']));
    
    // For testing: if no action is provided, default to 'create'
    if (!isset($postData['action']) && $testingMode) {
        $postData['action'] = 'create';
        testLog("No action specified, defaulting to 'create'");
    } elseif (!isset($postData['action'])) {
        echo json_encode(['error' => 'Action is required']);
        exit;
    }
    
    $action = $postData['action'] ?? null;
    $playerID = $postData['action'] ?? null;
    $playerName = $postData['playerName'] ?? null;
   
    switch ($action) {
        case 'join':
            $result = handleJoinGame($conn, $gameID, $postData);
            break;
            
        case 'create':
            $result = handleCreateGame($conn, $postData);
            break;

        case 'startGame':
            $result = startGame($gameID,$conn);
            break;
         
        case 'placeCard':
            if (!isset($postData['cardPlaced'])) {
                if ($testingMode) {
                    // Generate a random card for testing
                    $colors = ['red', 'blue', 'green', 'yellow'];
                    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    $postData['cardPlaced'] = $colors[array_rand($colors)] . '_' . $values[array_rand($values)];
                    testLog("Generated test card: " . $postData['cardPlaced']);
                } else {
                    echo json_encode(['error' => 'cardPlaced is required']);
                    exit;
                }
            }
            
            $playerID = $conn->real_escape_string($postData['playerID']);
            $cardPlaced = $conn->real_escape_string($postData['cardPlaced']);
            
            // Get current game state
            $gameState = fetchGameState($conn, $gameID, $playerID);
            
            // Handle card placement
            $result = handleCardPlacement($conn, $gameID, $playerID, $cardPlaced, $gameState);
            break;
            
        case 'drawCard':
            $playerID = $conn->real_escape_string($postData['playerID']);
            $result = handleDrawCard($conn, $gameID, $playerID);
            break;
            
        case 'chooseColor':
            if (!isset($postData['color'])) {
                if ($testingMode) {
                    $colors = ['red', 'blue', 'green', 'yellow'];
                    $postData['color'] = $colors[array_rand($colors)];
                    testLog("Generated test color: " . $postData['color']);
                } else {
                    echo json_encode(['error' => 'color is required']);
                    exit;
                }
            }
            
            $playerID = $conn->real_escape_string($postData['playerID']);
            $color = $conn->real_escape_string($postData['color']);
            $result = handleColorChoice($conn, $gameID, $playerID, $color);
            break;
        
        case 'endGame':
            if (!isset($postData['winnerID'])) {
                echo json_encode(['error' => 'winnerID is required']);
                exit;
            }
            
            $winnerID = $conn->real_escape_string($postData['winnerID']);
            $result = handleGameEnd($conn, $gameID, $winnerID);
            break;
            
        default:
            $result = ['error' => 'Unknown action: ' . $action];
            break;
    }

    // Get updated game state after action
    if ($action !== 'create' && $action !== 'placeCard' && $action !== 'endGame') { // placeCard and endGame already return a result
        $updatedGameState = isset($postData['playerID']) ? 
            fetchGameState($conn, $gameID, $conn->real_escape_string($postData['playerID'])) : 
            fetchGameState($conn, $gameID);
        
        // Merge the result with the updated game state
        if (is_array($result)) {
            $response = array_merge($result, $updatedGameState);
        } else {
            $response = $updatedGameState;
        }
        
        echo json_encode($response);
    } else {
        echo json_encode($result);
    }
}

/**
 * Handle game end - update statistics for all players
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

function createDeck() {
    $colors = ['Red', 'Yellow', 'Green', 'Blue'];
    $values = array_merge(range(0, 9), ['Skip', 'Reverse', 'Draw Two']);
    $deck = [];
    
    foreach ($colors as $color) {
        foreach ($values as $value) {
            $deck[] = "$color" . "_" . "$value";
            if ($value !== 0) $deck[] = "$color" . "_" . "$value"; 
        }
    }
    
    for ($i = 0; $i < 4; $i++) {
        $deck[] = 'Wild_Wild';
        $deck[] = 'Wild_DrawFour';
    }
    
    shuffle($deck);
    return $deck;
}

/**
 * Create a complete test game with multiple players
 */
function createTestGame($conn, $gameID) {
    testLog("Creating test game: " . $gameID);
    
    // First, create the game
    $creator = [
        'playerID' => 'test_player_1',
        'playerName' => 'Test Player 1',
        'gameID' => $gameID
    ];
    
    $result = handleCreateGame($conn, $creator);
    
    if (isset($result['error'])) {
        return $result;
    }
    
    // Add 2-3 more players
    $playerCount = rand(2, 3);
    
    for ($i = 2; $i <= $playerCount + 1; $i++) {
        $player = [
            'playerID' => 'test_player_' . $i,
            'playerName' => 'Test Player ' . $i,
            'gameID' => $gameID
        ];
        
        $joinResult = handleJoinGame($conn, $gameID, $player);
        
        if (isset($joinResult['error'])) {
            testLog("Error adding test player " . $i . ": " . $joinResult['error']);
        } else {
            testLog("Added test player " . $i);
        }
    }
    
    // Start the game
    $startResult = startGame($conn, $gameID);
    
    testLog("Test game created with " . ($playerCount + 1) . " players");
    
    return [
        'success' => true,
        'message' => 'Test game created with ' . ($playerCount + 1) . ' players',
        'gameID' => $gameID,
        'players' => [
            'test_player_1' => ['playerName' => 'Test Player 1'],
            'test_player_2' => ['playerName' => 'Test Player 2'],
        ]
    ];
}

/**
 * Handle joining an existing game
 */
function handleJoinGame($conn, $gameID, $postData) {
    if (!isset($postData['playerID']) || !isset($postData['playerName'])) {
        return ['error' => 'PlayerID and playerName are required to join a game'];
    }
    
    $playerID = $conn->real_escape_string($postData['playerID']);
    $playerName = $conn->real_escape_string($postData['playerName']);
    
    // Check if game exists
    $checkGameQuery = "SELECT playerList, gameStatus FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkGameQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Game not found'];
    }
    
    $gameData = $result->fetch_assoc();
    $playerList = json_decode($gameData['playerList'], true);
    $gameStatus = $gameData['gameStatus'];
    
    // Check if game has already started
    if ($gameStatus === 'inProgress') {
        // Check if player is rejoining
        if (!in_array($playerID, $playerList)) {
            return ['error' => 'Game has already started, cannot join'];
        }
    }
    
    // Add player to list if not already there
    if (!in_array($playerID, $playerList)) {
        $playerList[] = $playerID;
        $updatedPlayerList = json_encode($playerList);
        
        // Update player list in lobby
        $updateLobbyQuery = "UPDATE lobby SET playerList = ? WHERE gameID = ?";
        $stmt = $conn->prepare($updateLobbyQuery);
        $stmt->bind_param("ss", $updatedPlayerList, $gameID);
        $stmt->execute();
        
        // Add player to players table with initial cards
        $initialCards = generateRandomCards(7); // Start with 7 cards
        $cardsJson = json_encode($initialCards);
        
        $addPlayerQuery = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped) 
                           VALUES (?, ?, ?, ?, '', 0)";
        $stmt = $conn->prepare($addPlayerQuery);
        $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $cardsJson);
        $stmt->execute();
    }
    
    return ['success' => true, 'message' => 'Joined game successfully'];
}

/**
 * Handle creating a new game
 */
function handleCreateGame($conn, $postData) {
    if (empty($postData['gameID']) || empty($postData['playerID']) || empty($postData['playerName'])) {
        return ['error' => $postData['gameID'] . " ". $postData['playerID'] . "   ". $postData['playerName']];
    }
    
    $gameID = $conn->real_escape_string($postData['gameID']);
    $playerID = $conn->real_escape_string($postData['playerID']);
    $playerName = $conn->real_escape_string($postData['playerName']);
    $bet = $conn->real_escape_string($postData['bet_amount']);
    // Check if game already exists
    $checkGameQuery = "SELECT gameID FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkGameQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        return ['error' => 'Game ID already in use'];
    }
    
    // Initialize player list with creator
    $playerList = [$playerID];
    $playerListJson = json_encode($playerList);
    $gameOrderJson = json_encode($playerList); // Initial game order
    
    // Create an initial card for the game
    $colors = ['red', 'blue', 'green', 'yellow'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $initialCard = $colors[array_rand($colors)] . '_' . $values[array_rand($values)];
    
    // Create new game in lobby
    $createGameQuery = "INSERT INTO lobby (gameID, curCard, curPlayer, cardEffect, playerList, gameOrder, gameStatus, betting_amt) 
                        VALUES (?, ?, ?, '', ?, ?, 'waiting', ?)";
    $stmt = $conn->prepare($createGameQuery);
    $stmt->bind_param("sssssi", $gameID, $initialCard, $playerID, $playerListJson, $gameOrderJson, $bet);
    $stmt->execute();
    
    // Create player entry
    $initialCards = generateRandomCards(7); // Start with 7 cards
    $cardsJson = json_encode($initialCards);
    
    $addPlayerQuery = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped) 
                       VALUES (?, ?, ?, ?, '', 0)";
    $stmt = $conn->prepare($addPlayerQuery);
    $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $cardsJson);
    $stmt->execute();
    
    return ['success' => true, 'message' => 'Game created successfully', 'testGameID' => $gameID];
}

/**
 * Handle drawing a card
 */
function handleDrawCard($conn, $gameID, $playerID) {
    // Check if it's the player's turn
    $checkTurnQuery = "SELECT curPlayer FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkTurnQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Game not found'];
    }
    
    $row = $result->fetch_assoc();
    if ($row['curPlayer'] !== $playerID) {
        return ['error' => 'Not your turn'];
    }
    
    // Get player's current cards
    $getCardsQuery = "SELECT cardList FROM players WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($getCardsQuery);
    $stmt->bind_param("ss", $gameID, $playerID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Player not found'];
    }
    
    $playerData = $result->fetch_assoc();
    $cardList = json_decode($playerData['cardList'], true);
    
    // Generate a new random card
    $newCard = generateRandomCards(1)[0];
    $cardList[] = $newCard;
    $updatedCardList = json_encode($cardList);
    
    // Update player's cards
    $updateCardsQuery = "UPDATE players SET cardList = ? WHERE gameID = ? AND playerID = ?";
    $stmt = $conn->prepare($updateCardsQuery);
    $stmt->bind_param("sss", $updatedCardList, $gameID, $playerID);
    $stmt->execute();
    
    // Move to next player
    $gameState = fetchGameState($conn, $gameID, $playerID);
    moveToNextPlayer($conn, $gameID, $gameState);
    
    return ['success' => true, 'message' => 'Card drawn', 'newCard' => $newCard];
}

/**
 * Handle color choice for wild cards
 */
function handleColorChoice($conn, $gameID, $playerID, $color) {
    // Validate color
    $validColors = ['red', 'blue', 'green', 'yellow'];
    if (!in_array($color, $validColors)) {
        return ['error' => 'Invalid color choice'];
    }
    
    // Check if it's the player's turn and if the current card is a wild
    $checkCardQuery = "SELECT curCard, curPlayer FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkCardQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Game not found'];
    }
    
    $row = $result->fetch_assoc();
    if ($row['curPlayer'] !== $playerID) {
        return ['error' => 'Not your turn'];
    }
    
    $curCard = $row['curCard'];
    if (strpos($curCard, 'wild') === false) {
        return ['error' => 'Current card is not wild'];
    }
    
    // Update the current card with chosen color
    $newCard = "{$color}_wild";
    $updateCardQuery = "UPDATE lobby SET curCard = ? WHERE gameID = ?";
    $stmt = $conn->prepare($updateCardQuery);
    $stmt->bind_param("ss", $newCard, $gameID);
    $stmt->execute();
    
    return ['success' => true, 'message' => 'Color chosen', 'newColor' => $color];
}

/**
 * Start the game (move from waiting to inProgress)
 */
function startGame($conn, $gameID) {
    // Check if there are at least 2 players
    $query = "SELECT playerList FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    $gameData = $result->fetch_assoc();
    
    if (!$gameData) {
        return json_encode(["error" => "Game not found"]);
    }
    
    $players = json_decode($gameData['playerList'], true);
    if (!$players || count($players) < 2) {
        return json_encode(["error" => "Not enough players to start the game"]);
    }
    
    if (count($playerList) < 3) {
        return ['error' => 'Need at least 3 players to start'];
    }
    
    do {
        $startingCard = array_pop($deck);
    } while (strpos($startingCard, 'Wild_DrawFour') !== false);
    
    $firstPlayer = $players[array_rand($players)];
    
    $updateQuery = "UPDATE lobby SET curCard = ?, curPlayer = ?, gameOrder = ?, gameStatus = 'active', betting_amt = NULL WHERE gameID = ?";
    $stmt = $conn->prepare($updateQuery);
    $gameOrder = json_encode($players);
    $stmt->bind_param("ssss", $startingCard, $firstPlayer, $gameOrder, $gameID);
    $stmt->execute();
    
    return json_encode([
        'ok' => true,
        'players' => $hands,
        'startingCard' => $startingCard,
        'firstPlayer' => $firstPlayer
    ]);
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
        return ['error' => 'Game i found'];
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
            'gameStatus' => $lobbyData['gameStatus']
        ],
        'players' => $players,
        'yourTurn' => ($playerID && $lobbyData['curPlayer'] === $playerID)
    ];
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
        // In testing mode, allow the card even if not in hand
        global $testingMode;
        if (!$testingMode) {
            return ['error' => 'Card not in hand'];
        }
    } else {
        // Remove the card from player's hand
        array_splice($playerCards, $cardIndex, 1);
    }
    
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
        // Player has won, update stats
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
    
    return ['success' => true, 'message' => 'Card placed successfully'];
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
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw2'];
    $specialCards = ['wild_Wild', 'wild_Draw4'];
    $cards = [];

    for ($i = 0; $i < $count; $i++) {
        // Small chance of getting a special card
        if (rand(1, 10) > 8) {
            $cards[] = $specialCards[array_rand($specialCards)];
        } else {
            $color = $colors[array_rand($colors)];
            $value = $values[array_rand($values)];
            $cards[] = "{$color}_{$value}";
        }
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