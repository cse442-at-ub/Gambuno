<?php
require_once 'util.php';
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
//TODO:
// isValidCardPlay: add code  for +5 and +2
// processCardEffect : add code for drawing cards and handling special effects
// moveToNextPlayer: add code for handling skip and reverse effects
//TODO: Make it so wild_0 let you pick you color

function getDatabaseConnection(){
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";
    $dbname = "cse442_2025_spring_team_c_db";
    
    $conn = new mysqli($host, $user, $pass, $dbname);

    return $conn;
}

function generateGameCode($length = 6) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $code;
}


// Check if a player's turn is valid
function isPlayerTurn($gameID, $playerID)
{
    $h = json_encode(getCurrentPlayer($gameID));
    $currentPlayer = json_decode($h, true)["currentPlayer"];
    return ($currentPlayer) === $playerID;
    
}

$colorMap = [
    '0' => 'red',
    '1' => 'blue',
    '2' => 'green',
    '3' => 'yellow',

    '5' => 'red',
    '6' => 'blue',
    '7' => 'green',
    '8' => 'yellow'
];


// Validate if a card can be played based on current card in play
function isValidCardPlay($currentCard, $playedCard): bool
{//php treats 1 as true and 0 as false
    global $colorMap;
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
    list($currentColor, $currentValue) = explode('_', $currentCard);//explode = split
    list($playedColor, $playedValue) = explode('_', $playedCard);


//    if($playedValue < '0' || $playedValue > '9'){
//        return false;
//    }

    // Wild card can always be played
    if ($playedColor === 'wild') {
//        if($playedValue > '8' || $playedValue === '4'){
//            return false;
//        }
        return true;
    }


    if($currentColor === 'wild'){
        $currentColor = $colorMap[$currentValue];
//        if($currentColor === $playedColor){
//            return true;
//        }
    }

    // Same color or same value is a valid play
    if ($currentColor === $playedColor || $currentValue === $playedValue) {
        return true;
    }

    return false;
}

// Handle card placement
function placeCard($gameID, $playerID, $card) {

    if (!isPlayerTurn($gameID, $playerID)) {// if player not in turn dont play
        return json_encode(['success' => false, 'message' => 'Not your turn']);
        //returns: {"success":false,"message":"Not your turn"}
    }

    // Get current card in play
    $h = json_encode(getCurrentCard($gameID));
    $currentCard = json_decode($h, true)["curCard"];

    // Check if card is valid to play
    if (!isValidCardPlay($currentCard, $card)) {
        return json_encode(['success' => false, 'message' => 'Invalid card play']);
        //returns: {"success":false,"message":"Invalid card play"}
    }


    // Check if player has this card
    $s = json_encode(getCardList($playerID, $gameID));
    $playerCards = json_decode($s, true)["cardList"];
    $playerCardsArray = explode(',', $playerCards);

    if (!in_array(wildConversion($card), $playerCardsArray)) {
        return json_encode(['success' => false, 'message' => 'You do not have this card']);
    }

    // Set the placed card
    setPlacedCard($gameID, $playerID, $card);//might need to be wildConversion($card) instead of $card

    // Remove card from player's hand
    $playerCardsArray = array_diff($playerCardsArray, [wildConversion($card)]);//returns array of cards without the played card
    setCardList($gameID, $playerID, implode(',', $playerCardsArray));

    // Update current card in play
    setCurrentCard($gameID, $card);

    // Process card effects if any
    processCardEffect($gameID, $card);

    // Check if player has won (no cards left)
    if (count($playerCardsArray) === 0) {
        handleGameWin( $gameID, $playerID);
        return json_encode(['success' => true, 'message' => 'You win!', 'game_over' => true]);
    }

    // Move to next player's turn
    moveToNextPlayer($gameID);

    return json_encode(['success' => true, 'message' => 'Card played successfully']);
}


function wildConversion($card){
    list($color, $value) = explode('_', $card);
    $value = (int) ($value);
    if($color === 'wild'){
        if($value >= "0" && $value <= "3"){
            $card = 'wild_0';
        }
        elseif ($value >= 5 && $value <= 8){
            $card = 'wild_5';
        }
    }
    return $card;
}


// Process special card effects
function processCardEffect($gameID, $card) {
    list($color, $value) = explode('_', $card);
    $effect = null;
    

    if($value === 'skip'){
        $effect = 'skip';
    }
    else if($value === 'reverse'){
        $effect = 'reverse';
    }
    else if($color === 'wild'){
        $value = (int) ($value);
        if($value >= 5 && $value <= 8){
            $effect = 'draw5';
        }
    }
    else{return;}

    switch ($effect):
        case 'draw5':
            $player = getNextPlayer($gameID);
            
            $s = json_encode(getCardList($player, $gameID));
            $playerCards = json_decode($s, true)["cardList"];
            $playerCardsArray = explode(',', $playerCards);
            

            $newCards = generateCards(5);
            $newCards = implode(",", $newCards);
            $playerCardsArray[] = $newCards;
            setCardList($gameID, $player, implode(',', $playerCardsArray));

            $effect = 'draw5';
            setCardEffect($gameID, $effect);
            // Draw 5 cards logic
            break;
        case 'reverse':
            setCardEffect($gameID, $effect);

            $s = json_encode(getGameOrder($gameID));
            $gameOrder =json_decode($s, true)["gameOrder"];
            $gameOrderArray = explode(',', implode(",", $gameOrder));
            $gameOrderArray = array_reverse($gameOrderArray);
            setGameOrder($gameID, implode(',', $gameOrderArray));
            setCardEffect($gameID, $effect);
            break;
        case 'skip':
            setCardEffect($gameID, $effect);
            break;
        default:
//            setCardEffect($gameID, $effect);
    endswitch;

}


function getNextPlayer($gameID) {
    // Get current player
    $s = json_encode(getCurrentPlayer($gameID));
    $currentPlayer = json_decode($s, true)["currentPlayer"];

    // Get game order
    $b = json_encode(getGameOrder($gameID));
    $gameOrderArray = json_decode($b, true)["gameOrder"];
    $gameOrderArray = explode(',', implode(",",$gameOrderArray));

    // Find current player's index
    $currentIndex = array_search($currentPlayer, $gameOrderArray);

    // Determine next player index with wrap-around
    $nextIndex = ($currentIndex + 1) % count($gameOrderArray);

    // Return next player
    return $gameOrderArray[$nextIndex];
}


// Move to the next player's turn
function moveToNextPlayer($gameID) {

    $s = json_encode(getCurrentPlayer($gameID));
    $currentPlayer = json_decode($s, true)["currentPlayer"];

    // Find current player index
    $b = json_encode(getGameOrder($gameID));
    $gameOrderArray = json_decode($b, true)["gameOrder"];
    $gameOrderArray = explode(',', implode(",",$gameOrderArray));

    $currentIndex = array_search($currentPlayer, $gameOrderArray);
    
    // Get card effect if any
    $h = json_encode(getCardEffect($gameID));
    $cardEffect = json_decode($h, true)["effect"];
    // Determine next player index
    $nextIndex = ($currentIndex + 1) % count($gameOrderArray); // ensures circular ordering

//    // Handle skip effect
    if ($cardEffect === 'skip') {
        $nextIndex = ($nextIndex + 1) % count($gameOrderArray);
        $effect = 'NULL';
        // Reset card effect after applying
        setCardEffect($gameID, $effect);
    }
    
    // Set next player
    setCurrentPlayer($gameID, $gameOrderArray[$nextIndex]);
}

// Handle player drawing a card
function drawCard($gameID, $playerID, $auto) {
    // Check if it's player's turn
    if (!isPlayerTurn($gameID, $playerID)) {
        return json_encode(['success' => false, 'message' => 'Not your turn']);
    }

    // Get player's current cards
    $s = json_encode(getCardList($playerID, $gameID));
    $playerCards = json_decode($s, true)["cardList"];
    $playerCardsArray = explode(',', $playerCards);

//    // Generate a random card (in a real game, you'd draw from a deck)
//    $colors = ['red', 'blue', 'green', 'yellow', 'wild'];
//    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];//, 'skip', 'reverse', 'draw2'
//
//    if (rand(0, 10) > 8) {  // 20% chance of wild card
//        $newCard = 'wild_' . rand(0, 0); // Only wild_0 for now
//    } else {
//        $color = $colors[rand(0, 3)]; // Exclude wild
//        $value = $values[rand(0, count($values) - 1)];
//        $newCard = $color . '_' . $value;
//    }

    $newCard = generateCards(1)[0];
    // Add card to player's hand
    $playerCardsArray[] = $newCard;
    setCardList($gameID, $playerID, implode(',', $playerCardsArray));

    // Move to next player's turn

    $h = json_encode(getCurrentCard($gameID));
    $currentCard = json_decode($h, true)["curCard"];

    // Check if card is valid to play

    if(!isValidCardPlay($currentCard, $newCard) || $auto){
        moveToNextPlayer($gameID);
    }
    
    
    
    return json_encode(['success' => true, 'message' => 'Card drawn successfully', 'new_card' => $newCard]);
}

// Handle game win scenario
function handleGameWin($gameID, $playerID) {
    //should have the follow methods, updatePlayerWins($gameID, $playerID), updatePlayersStats($gameID, $playerID)
    // Update game status
    setGameStatus($gameID, 'finished');
    $i = json_encode(getBettingAmount($gameID));
    $bettingAmt = json_decode($i, true)["betting"];
    
    //$w = json_encode(getWins($playerID));
    //$win = json_decode($w, true)["wins"];

    $b = json_encode(getPlayerList($gameID));
    $playersObj= json_decode($b, true)["playerList"];
    $players = explode(",", $playersObj);
    
    $totalPot = $bettingAmt * count($players);
    
    // Add winnings to player's account
    $h = json_encode(getMoney($playerID));
    $currentMoney = json_decode($h, true)["money"];
    setMoney($playerID, ($currentMoney + $totalPot));

    //setWins($playerID, ((int)$wins)+1);
}

// Create a new game
function createGame($playerID, $bettingAmount) {
    // Generate unique game ID
    $gameID = generateGameCode();

    // Check if player has enough money
    $h = json_encode(getMoney($playerID));
    $playerMoney = json_decode($h, true)["money"];

    if ($playerMoney < $bettingAmount) {
        return json_encode(['success' => false, 'message' => 'Not enough money']);
    }

    // Deduct betting amount
    setMoney($playerID, $playerMoney - $bettingAmount);

//    // Generate initial card
//    $colors = ['red', 'blue', 'green', 'yellow'];
//    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//    $initialCard = $colors[rand(0, 3)] . '_' . $values[rand(0, 9)];
    $initialCard = generateCards(1)[0];
    $conn = getDatabaseConnection();

    //$s = json_encode(getTotalGame($playerID));
    //$total_games = json_decode($h, true)["totalgames"];

    // Create lobby entry
    $stmt = $conn->prepare("INSERT INTO lobby (gameID, curCard, curPlayer, playerList, gameOrder, betting_amt, gameStatus, cardEffect, host) VALUES (?, ?, ?, ?, ?, ?, 'waiting', '', ?)");
    $playerList = json_encode([$playerID]);
    $gameOrder = json_encode([$playerID]);
    $host = $playerID;
    $stmt->bind_param("sssssis", $gameID, $initialCard, $playerID, $playerList, $gameOrder, $bettingAmount, $host);
    $stmt->execute();

    // Create player entry
    $playerName = $playerID;
    $initialCards = json_encode(generateCards(7));
    $stmt = $conn->prepare("INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped) VALUES (?, ?, ?, ?, '', 0)");
    $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $initialCards);
    $stmt->execute();
    
    //setTotalGame($playerID, ((int) $total_games) + 1);
    


    return json_encode(['success' => true, 'message' => 'Game created successfully', 'gameID' => $gameID]);
}

// Join an existing game
function joinGame($gameID, $playerID) {
    // Check if game exists and is waiting
   
    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("SELECT gameStatus, betting_amt, playerList FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    $row = $result->fetch_assoc();

    if ($row['gameStatus'] !== 'waiting') {
        return json_encode(['success' => false, 'message' => 'Game already in progress or finished']);
    }
    
    // Check if player has enough money
    $h = json_encode(getMoney($playerID));
    $playerMoney = json_decode($h, true)["money"];

    if ($playerMoney < $row['betting_amt']) {
        return json_encode(['success' => false, 'message' => 'Not enough money']);
    }

    // Check if player already in the game
    $playersObj = getPlayerList($gameID);
    $players = explode(',', $playersObj["playerList"]);
    

    if (in_array($playerID, $players)) {
        return json_encode(['success' => false, 'message' => 'Already in game']);
    }

    if (count($players) >= 6) {
        return json_encode(['success' => false, 'message' => 'Game is full']);
    }

    // Deduct betting amount
    setMoney($playerID, $playerMoney - $row['betting_amt']);
    // Add player to game
    $players[] = $playerID;
    $playerList = json_encode($players);
    $gameOrder = json_encode($players); // Simple order for now
    
    $stmt = $conn->prepare("UPDATE lobby SET playerList = ?, gameOrder = ? WHERE gameID = ?");
    $stmt->bind_param("sss", $playerList, $gameOrder, $gameID);
    $stmt->execute();

    // Add player to player table
    $initialCards = json_encode(generateCards(7));
    $stmt = $conn->prepare("INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped) VALUES (?, ?, ?, ?, '', 0)");
    $stmt->bind_param("ssss", $gameID, $playerID, $playerID, $initialCards);
    $stmt->execute();

    return json_encode(['success' => true, 'message' => 'Joined game successfully']);
}

// Generate initial cards for a player (7 random cards)
function generateCards($numberOfCards): array
{
    $colors = ['red', 'blue', 'green', 'yellow'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $cards = [];

    for ($i = 0; $i < $numberOfCards; $i++) {
        if (rand(0, 3) > 2) {  // 25% chance of special card
            $randomValue = rand(0, 2);// 0 = skip, 1 = reverse, 2 = wilds
            $color = $colors[rand(0, 3)];

            if($randomValue === 0){
                $cards[] = $color . '_skip';
            }

            if($randomValue === 1){
                $cards[] = $color . '_reverse';
            }

            if($randomValue === 2){
               if(rand(0, 1) === 0){
                    $cards[] = 'wild_0';
                }else{
                    $cards[] = 'wild_5';
                }
            }

        } else {
            $color = $colors[rand(0, 3)];
            $value = $values[rand(0, count($values) - 1)];
            $cards[] = $color . '_' . $value;
        }
    }

    return ($cards);
}

// Start the game if enough players have joined
function startGame($gameID, $playerID) {//just call
    // Check if requester is game creator
    //should be calling getHost($gameID)

    $h = json_encode(getHost($gameID));
    $host = json_decode($h, true)["currentPlayer"];

    if ($host !== $playerID) {
        return json_encode(['success' => false, 'message' => 'Only the host can start the game']);
    }
    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("SELECT playerList, gameStatus FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    $row = $result->fetch_assoc();


    if ($row['gameStatus'] !== 'waiting') {
        return json_encode(['success' => false, 'message' => 'Game already started or finished']);
    }

    $players = explode(',', $row['playerList']);
    if (count($players) < 2) {
        return json_encode(['success' => false, 'message' => 'Need at least 2 players to start']);
    }

    // Update game status
    setGameStatus($gameID, 'inProgress');

    return json_encode(['success' => true, 'message' => 'Game started successfully']);
}

// Get game state for a player
function getGameState( $gameID, $playerID) {
    //call getGame($gameID)
    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("SELECT * FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $lobbyResult = $stmt->get_result();

    if ($lobbyResult->num_rows === 0) {
        return json_encode(['success' => false, 'message' => 'Game not found']);
    }

    $lobbyData = $lobbyResult->fetch_assoc();

    // Get player data
    $stmt = $conn->prepare("SELECT * FROM players WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $playerResult = $stmt->get_result();

    $players = [];//list of list
    while ($playerData = $playerResult->fetch_assoc()) {
        // Only include card count for other players, not their actual cards
        if ($playerData['playerID'] !== $playerID) {
            $cardCount = count(explode(',', $playerData['cardList']));
            $playerData['cardCount'] = $cardCount;
            unset($playerData['cardList']);
        }
        $players[] = $playerData;
    }

    // Create game state response
    $gameState = [
        'success' => true,
        'gameID' => $gameID,
        'currentCard' => $lobbyData['curCard'],
        'currentPlayer' => $lobbyData['curPlayer'],
        'isYourTurn' => ($lobbyData['curPlayer'] === $playerID),
        'gameStatus' => $lobbyData['gameStatus'],
        'cardEffect' => $lobbyData['cardEffect'],
        'players' => $players,
        'gameOrder' => explode(',', $lobbyData['gameOrder']),
        'bettingAmount' => $lobbyData['betting_amt']
    ];

    return json_encode($gameState);
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
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $data['bettingAmount'] = htmlspecialchars($data['bettingAmount'], ENT_QUOTES, 'UTF-8');
            echo createGame( $playerID, $data['bettingAmount']);
            break;

        case 'join_game':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            echo joinGame($gameID, $playerID);
            break;

        case 'start_game':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            echo startGame($gameID, $playerID);
            break;

        case 'place_card':
            if (!$gameID || !isset($data['card'])) {
                echo json_encode(['success' => false, 'message' => 'Game ID and card required']);
                break;
            }
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            $data['card'] = htmlspecialchars($data['card'], ENT_QUOTES, 'UTF-8');
            echo placeCard( $gameID, $playerID, $data['card']);
            break;

        case 'draw_card':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            $auto = $data["auto"];
            $auto = htmlspecialchars($auto, ENT_QUOTES, 'UTF-8');
            echo drawCard($gameID, $playerID, $auto);
            break;

        case 'get_game_state':
            if (!$gameID) {
                echo json_encode(['success' => false, 'message' => 'Game ID required']);
                break;
            }
            $playerID = htmlspecialchars($playerID, ENT_QUOTES, 'UTF-8');
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            echo getGameState($gameID, $playerID);
            break;
        
        case 'move':
            $card = $data["card"];
            $gameID = htmlspecialchars($gameID, ENT_QUOTES, 'UTF-8');
            echo moveToNextPlayer($gameID);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
    }
} else if ($requestMethod === 'GET') {
    // Handle GET requests (if any)
    echo json_encode(['success' => false, 'message' => 'Please use POST requests']);
}

$conn->close();
?>
