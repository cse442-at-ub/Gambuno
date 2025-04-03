<?php
require_once 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

//header('Access-Control-Allow-Origin: your-frontend-domain.com');

// Check if a player's turn is valid
function isPlayerTurn($gameID, $playerID): bool
{
    $currentPlayerData = getCurrentPlayer($gameID);
    // Ensure we're working with an array
    $currentPlayerData = is_string($currentPlayerData) ? json_decode($currentPlayerData, true) : $currentPlayerData;
    $currentPlayer = $currentPlayerData['currentPlayer'] ?? '';
    // Remove quotes if they exist
    $currentPlayer = is_string($currentPlayer) ? trim($currentPlayer, '"') : $currentPlayer;
    return $currentPlayer === $playerID;
}

// Validate if a card can be played based on current card in play
function isValidCardPlay($currentCard, $playedCard) {
    if (empty($currentCard) || empty($playedCard)) {
        return false; // If either card is empty, invalid play
    }
    $currentCard = htmlspecialchars($currentCard, ENT_QUOTES, 'UTF-8');
    $playedCard = htmlspecialchars($playedCard, ENT_QUOTES, 'UTF-8');

    // Validate card format using regex to prevent injection
    if (!preg_match('/^[a-z]+_[a-z0-9]+$/', $currentCard) || !preg_match('/^[a-z]+_[a-z0-9]+$/', $playedCard)) {
        return false;
    }

    // Extract color and number from both cards
    list($currentColor, $currentValue) = explode('_', $currentCard);
    list($playedColor, $playedValue) = explode('_', $playedCard);

    // Wild card can always be played
    if ($playedColor === 'wild') {
        //TODO: add logic to handle +5 wild card
        return true;
    }

    // Same color or same value is a valid play
    if ($currentColor === $playedColor || $currentValue === $playedValue) {
        return true;
    }

    return false;
}

// Handle card placement
function placeCard($gameID, $playerID, $card) {
    if (!isPlayerTurn($gameID, $playerID)) {
        return json_encode(['success' => false, 'message' => 'Not your turn']);
    }

    // Get current card in play
    $currentCardJson = getCurrentCard($gameID);
    // Ensure we have an array
    $currentCardData = is_string($currentCardJson) ? json_decode($currentCardJson, true) : $currentCardJson;
    $currentCard = $currentCardData['curCard'] ?? '';

    // Check if card is valid to play
    if (!isValidCardPlay($currentCard, $card)) {
        return json_encode(['success' => false, 'message' => 'Invalid card play']);
    }

    // Check if player has this card
    $playerCards = getPlayerCardList($playerID);
    // Ensure we have an array of cards
    $playerCardsArray = [];
    if (is_string($playerCards)) {
        // Try JSON decode first
        $decoded = json_decode($playerCards, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $playerCardsArray = $decoded;
        } else {
            // Fall back to comma separation if not JSON
            $playerCardsArray = explode(',', $playerCards);
        }
    } else {
        $playerCardsArray = $playerCards;
    }

    if (!in_array($card, $playerCardsArray)) {
        return json_encode(['success' => false, 'message' => 'You do not have this card']);
    }

    // Remove card from player's hand
    $playerCardsArray = array_diff($playerCardsArray, [$card]);
    // Ensure we save as JSON
    setCardList($gameID, $playerID, json_encode(array_values($playerCardsArray)));

    // Update current card in play
    setCurrentCard($gameID, $card);

    // TODO: add the card effects
//    processCardEffect($gameID, $card);

    // Check if player has won (no cards left)
    if (count($playerCardsArray) === 0) {
        handleGameWin($gameID, $playerID);
        return json_encode(['success' => true, 'message' => 'You win!', 'game_over' => true]);
    }

    // Move to next player's turn
    moveToNextPlayer($gameID);

    return json_encode(['success' => true, 'message' => 'Card played successfully']);
}

// Process special card effects
function processCardEffect($gameID, $card) {
    list($color, $value) = explode('_', $card);
    $effect = null;
    $gameData = getGame($gameID);
    // Ensure we have an array
    $gameData = is_string($gameData) ? json_decode($gameData, true) : $gameData;
    $nextPlayer = getNextPlayer($gameID);

    // Determine card effect based on value
    if ($value === 'skip') {
        $effect = 'skip';
    } else if ($value === 'reverse') {
        $effect = 'reverse';
        // Reverse the game order
        $gameOrder = $gameData['gameOrder'];
        // Handle both JSON and comma-separated strings
        $gameOrderArray = [];
        if (is_string($gameOrder)) {
            $decoded = json_decode($gameOrder, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $gameOrderArray = $decoded;
            } else {
                $gameOrderArray = explode(',', $gameOrder);
            }
        } else {
            $gameOrderArray = $gameOrder;
        }
        $gameOrderArray = array_reverse($gameOrderArray);
        setGameOrder($gameID, json_encode($gameOrderArray));
    } else if ($value === 'draw2') {
        $effect = 'draw2';
        // Give next player 2 cards
        for ($i = 0; $i < 2; $i++) {
            addCardToPlayer($gameID, $nextPlayer);
        }
    } else if ($value === 'draw5') {
        $effect = 'draw5';
        // Give next player 5 cards
        for ($i = 0; $i < 5; $i++) {
            addCardToPlayer($gameID, $nextPlayer);
        }
    } else if ($color === 'wild') {
        $effect = 'wild';
        // Wild card effect handled by front-end choice
    }

    // Set card effect in the database
    if ($effect) {
        setCardEffect($gameID, $effect);
    }
}

// Helper function to add a random card to a player's hand
function addCardToPlayer($gameID, $playerID) {
    // Get player's current cards
    $playerCards = getPlayerCardList($playerID);

    // Ensure we have an array of cards
    $playerCardsArray = [];
    if (is_string($playerCards)) {
        // Try JSON decode first
        $decoded = json_decode($playerCards, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $playerCardsArray = $decoded;
        } else {
            // Fall back to comma separation if not JSON
            $playerCardsArray = explode(',', $playerCards);
        }
    } else {
        $playerCardsArray = $playerCards;
    }

    // Generate a random card
    //TODO: add stuff for plus 5 wild cards,(wild_5)
    $colors = ['red', 'blue', 'green', 'yellow','wild'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (rand(0, 10) > 8) {  // 20% chance of wild card
        $newCard = 'wild_0';
    } else {
        $color = $colors[rand(0, 3)];
        $value = $values[rand(0, count($values) - 1)];
        $newCard = $color . '_' . $value;
    }

    // Add card to player's hand
    $playerCardsArray[] = $newCard;
    // Always save as JSON
    setCardList($gameID, $playerID, json_encode($playerCardsArray));

    return $newCard;
}

// Helper function to get the next player
function getNextPlayer($gameID) {
    $gameData = getGame($gameID);
    // Ensure we have an array
    $gameData = is_string($gameData) ? json_decode($gameData, true) : $gameData;
    $currentPlayer = $gameData['curPlayer'];

    // Handle gameOrder in both formats
    $gameOrderArray = [];
    if (is_string($gameData['gameOrder'])) {
        $decoded = json_decode($gameData['gameOrder'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $gameOrderArray = $decoded;
        } else {
            $gameOrderArray = explode(',', $gameData['gameOrder']);
        }
    } else {
        $gameOrderArray = $gameData['gameOrder'];
    }

    // Find current player index
    $currentIndex = array_search($currentPlayer, $gameOrderArray);

    // Get next player index
    $nextIndex = ($currentIndex + 1) % count($gameOrderArray);

    return $gameOrderArray[$nextIndex];
}

// Move to the next player's turn
function moveToNextPlayer($gameID) {
    $gameDataJson = getGame($gameID);
    $gameData = is_string($gameDataJson) ? json_decode($gameDataJson, true) : $gameDataJson;
    $currentPlayer = $gameData['curPlayer'];

    // Handle gameOrder in both formats
    $gameOrderArray = [];
    if (is_string($gameData['gameOrder'])) {
        $decoded = json_decode($gameData['gameOrder'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $gameOrderArray = $decoded;
        } else {
            $gameOrderArray = explode(',', $gameData['gameOrder']);
        }
    } else {
        $gameOrderArray = $gameData['gameOrder'];
    }

    $cardEffect = $gameData['cardEffect'];

    // Find current player index
    $currentIndex = array_search($currentPlayer, $gameOrderArray);

    // Determine next player index
    $nextIndex = ($currentIndex + 1) % count($gameOrderArray); // ensures circular ordering

    // TODO: Handle skip effect
//    if ($cardEffect === 'skip') {
//        $nextIndex = ($nextIndex + 1) % count($gameOrderArray);
//        // Reset card effect after applying
//        setCardEffect($gameID, '');
//    }

    // Set next player
    setCurrentPlayer($gameID, $gameOrderArray[$nextIndex]);
}

function drawCard($gameID, $playerID) {
    // Check if it's player's turn
    if (!isPlayerTurn($gameID, $playerID)) {
        return json_encode(['success' => false, 'message' => 'Not your turn']);
    }

    // Add a card to player's hand
    $newCard = addCardToPlayer($gameID, $playerID);

    // Move to next player's turn
    moveToNextPlayer($gameID);

    return json_encode(['success' => true, 'message' => 'Card drawn successfully', 'new_card' => $newCard]);
}

// Handle game win scenario
function handleGameWin($gameID, $playerID) {
    // Update game status
    setGameStatus($gameID, 'finished');

    // Update player stats
    updatePlayerWins($gameID, $playerID);
    updatePlayersStats($gameID, $playerID);

    $bettingAmtData = getBettingAmount($gameID);
    $bettingAmt = is_string($bettingAmtData) ? json_decode($bettingAmtData, true) : $bettingAmtData;

    $playersData = getPlayerList($gameID);
    $players = [];
    if (is_string($playersData)) {
        $decoded = json_decode($playersData, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $players = $decoded;
        } else {
            $players = explode(',', $playersData);
        }
    } else {
        $players = $playersData;
    }

    $totalPot = $bettingAmt * count($players);

    // Add winnings to player's account
    $currentMoneyData = getMoney($playerID);
    $currentMoney = is_string($currentMoneyData) ? json_decode($currentMoneyData, true) : $currentMoneyData;
    setMoney($playerID, $currentMoney + $totalPot);
}

// Create a new game
function createGame($playerID, $bettingAmount) {
    // Generate unique game ID
    $gameID = uniqid();

    // Check if player has enough money
    $playerMoneyJson = getMoney($playerID);
    $playerMoney = is_string($playerMoneyJson) ? json_decode($playerMoneyJson, true) : $playerMoneyJson;

    if ($playerMoney < $bettingAmount) {
        return json_encode(['success' => false, 'message' => 'Not enough money']);
    }

    // Deduct betting amount
    setMoney($playerID, $playerMoney - $bettingAmount);

    // Generate initial cur card
    $colors = ['red', 'blue', 'green', 'yellow'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $initialCard = $colors[rand(0, 3)] . '_' . $values[rand(0, 9)];

    $conn = getDatabaseConnection();

    // Create lobby entry
    $stmt = $conn->prepare("INSERT INTO lobby (gameID, curCard, curPlayer, playerList, gameOrder, betting_amt, gameStatus, cardEffect) VALUES (?, ?, ?, ?, ?, ?, 'waiting', '')");
    // Store as JSON strings
    $playerList = json_encode([$playerID]);
    $gameOrder = json_encode([$playerID]);
    $stmt->bind_param("sssssi", $gameID, $initialCard, $playerID, $playerList, $gameOrder, $bettingAmount);
    $stmt->execute();

    // Set host for the game
    setHost($gameID, $playerID);

    // Create player entry
    $playerNameData = getPlayerName($playerID);
    $playerName = is_string($playerNameData) ? json_decode($playerNameData, true) : $playerNameData;
    $initialCards = generateInitialCards();
    $stmt = $conn->prepare("INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games) VALUES (?, ?, ?, ?, '', 0, 0, 0)");
    $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $initialCards);
    $stmt->execute();

    return json_encode(['success' => true, 'message' => 'Game created successfully', 'gameID' => $gameID]);
}

// Join an existing game
function joinGame($gameID, $playerID) {
    // Check if game exists and is waiting
    $gameData = getGame($gameID);
    $gameData = is_string($gameData) ? json_decode($gameData, true) : $gameData;

    if (!$gameData) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    if ($gameData['gameStatus'] !== 'waiting') {
        return json_encode(['success' => false, 'message' => 'Game already in progress or finished']);
    }

    // Check if player has enough money
    $playerMoneyData = getMoney($playerID);
    $playerMoney = is_string($playerMoneyData) ? json_decode($playerMoneyData, true) : $playerMoneyData;

    if ($playerMoney < $gameData['betting_amt']) {
        return json_encode(['success' => false, 'message' => 'Not enough money']);
    }

    // Check if player already in the game
    $players = [];
    if (is_string($gameData['playerList'])) {
        $decoded = json_decode($gameData['playerList'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $players = $decoded;
        } else {
            $players = explode(',', $gameData['playerList']);
        }
    } else {
        $players = $gameData['playerList'];
    }

    if (in_array($playerID, $players)) {
        return json_encode(['success' => false, 'message' => 'Already in game']);
    }

    // Deduct betting amount
    setMoney($playerID, $playerMoney - $gameData['betting_amt']);

    // Add player to game
    $players[] = $playerID;
    // Always store as JSON
    $playerList = json_encode($players);
    $gameOrder = $playerList; // Simple order for now

    $conn = getDatabaseConnection();

    $stmt = $conn->prepare("UPDATE lobby SET playerList = ?, gameOrder = ? WHERE gameID = ?");
    $stmt->bind_param("sss", $playerList, $gameOrder, $gameID);
    $stmt->execute();

    // Create player entry
    $playerNameData = getPlayerName($playerID);
    $playerName = is_string($playerNameData) ? json_decode($playerNameData, true) : $playerNameData;
    $initialCards = generateInitialCards();
    $stmt = $conn->prepare("INSERT INTO player (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games) VALUES (?, ?, ?, ?, '', 0, 0, 0)");
    $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $initialCards);
    $stmt->execute();

    return json_encode(['success' => true, 'message' => 'Joined game successfully']);
}

// Generate initial cards for a player (7 random cards)
function generateInitialCards() {
    $colors = ['red', 'blue', 'green', 'yellow'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
    $cards = [];

    for ($i = 0; $i < 7; $i++) {
        if (rand(0, 10) > 8) {  // 20% chance of wild card
            $cards[] = 'wild_0';
        } else {
            $color = $colors[rand(0, 3)];
            $value = $values[rand(0, count($values) - 1)];
            $cards[] = $color . '_' . $value;
        }
    }

    // Return as JSON string consistently
    return json_encode($cards);
}

// Start the game if enough players have joined
function startGame($gameID, $playerID) {
    // Check if requester is game creator
    $hostData = getHost($gameID);
    $host = is_string($hostData) ? json_decode($hostData, true) : $hostData;

    if ($host !== $playerID) {
        return json_encode(['success' => false, 'message' => 'Only the host can start the game']);
    }

    $gameData = getGame($gameID);
    $gameData = is_string($gameData) ? json_decode($gameData, true) : $gameData;

    if (!$gameData) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    if ($gameData['gameStatus'] !== 'waiting') {
        return json_encode(['success' => false, 'message' => 'Game already started or finished']);
    }

    // Get player list in consistent format
    $players = [];
    if (is_string($gameData['playerList'])) {
        $decoded = json_decode($gameData['playerList'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $players = $decoded;
        } else {
            $players = explode(',', $gameData['playerList']);
        }
    } else {
        $players = $gameData['playerList'];
    }

    if (count($players) < 2) {
        return json_encode(['success' => false, 'message' => 'Need at least 2 players to start']);
    }

    // Update game status
    setGameStatus($gameID, 'inProgress');

    return json_encode(['success' => true, 'message' => 'Game started successfully']);
}

// Set card effect in the database
function setCardEffect($gameID, $effect) {
    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("UPDATE lobby SET cardEffect = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $effect, $gameID);
    $stmt->execute();
}

// Set game order in the database
function setGameOrder($gameID, $gameOrder) {
    // Ensure gameOrder is stored as JSON string
    if (!is_string($gameOrder)) {
        $gameOrder = json_encode($gameOrder);
    } else {
        // Check if it's already a JSON string
        json_decode($gameOrder);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Not a valid JSON, convert it
            $gameOrder = json_encode(explode(',', $gameOrder));
        }
    }

    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("UPDATE lobby SET gameOrder = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $gameOrder, $gameID);
    $stmt->execute();
}

// Get game state for a player
function getGameState($gameID, $playerID) {
    // Check if game exists
    $gameData = getGame($gameID);
    $gameData = is_string($gameData) ? json_decode($gameData, true) : $gameData;

    if (!$gameData) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    $conn = getDatabaseConnection();
    // Get player data
    $stmt = $conn->prepare("SELECT * FROM player WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $playerResult = $stmt->get_result();

    $players = [];
    while ($playerData = $playerResult->fetch_assoc()) {
        // Ensure card list is in consistent format
        if (isset($playerData['cardList'])) {
            $cardList = $playerData['cardList'];
            $cardArray = [];

            // Try to decode as JSON first
            $decoded = json_decode($cardList, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $cardArray = $decoded;
            } else {
                // Fall back to comma separation if not JSON
                $cardArray = explode(',', $cardList);
            }

            // Only include card count for other players, not their actual cards
            if ($playerData['playerID'] !== $playerID) {
                $playerData['cardCount'] = count($cardArray);
                unset($playerData['cardList']);
            } else {
                // Update the card list to be an array
                $playerData['cardList'] = $cardArray;
            }
        }

        $players[] = $playerData;
    }

    // Parse game order consistently
    $gameOrder = [];
    if (isset($gameData['gameOrder'])) {
        if (is_string($gameData['gameOrder'])) {
            $decoded = json_decode($gameData['gameOrder'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $gameOrder = $decoded;
            } else {
                $gameOrder = explode(',', $gameData['gameOrder']);
            }
        } else {
            $gameOrder = $gameData['gameOrder'];
        }
    }

    // Get host consistently
    $hostData = getHost($gameID);
    $host = is_string($hostData) ? json_decode($hostData, true) : $hostData;

    // Create game state response
    $gameState = [
        'success' => true,
        'gameID' => $gameID,
        'currentCard' => $gameData['curCard'],
        'currentPlayer' => $gameData['curPlayer'],
        'isYourTurn' => ($gameData['curPlayer'] === $playerID),
        'gameStatus' => $gameData['gameStatus'],
        'cardEffect' => $gameData['cardEffect'],
        'players' => $players,
        'gameOrder' => $gameOrder,
        'bettingAmount' => $gameData['betting_amt'],
        'host' => $host
    ];

    return json_encode($gameState);
}

// Handle preflight CORS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

// Main request handler
$requestMethod = $_SERVER['REQUEST_METHOD'];
$conn = getDatabaseConnection();

if ($requestMethod === 'POST') {
    // Get request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Check if request is valid
    if (!isset($data['action']) || !isset($data['playerID'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $action = $data['action'];
    $playerID = $data['playerID'];
    $gameID = $data['gameID'] ?? null;

    switch ($action) {
        case 'create_game':
            if (!isset($data['bettingAmount'])) {
                echo json_encode(['success' => false, 'message' => 'Betting amount required']);
                break;
            }
            echo createGame($playerID, $data['bettingAmount']);
            break;

        case 'join_game':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            echo joinGame($gameID, $playerID);
            break;

        case 'start_game':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            echo startGame($gameID, $playerID);
            break;

        case 'place_card':
            if (!$gameID || !isset($data['card'])) {
                echo json_encode(['success' => false, 'message' => 'Game ID and card required']);
                break;
            }
            echo placeCard($gameID, $playerID, $data['card']);
            break;

        case 'draw_card':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            echo drawCard($gameID, $playerID);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
    }
} else if ($requestMethod === 'GET') {
    // Get parameters
    $action = $_GET['action'] ?? null;
    $playerID = $_GET['playerID'] ?? null;
    $gameID = $_GET['gameID'] ?? null;

    if (!$action || !$playerID) {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    switch ($action) {
        case 'get_game_state':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            echo getGameState($gameID, $playerID);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid GET action']);
    }
}

$conn->close();
?>