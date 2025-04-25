<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}
if (php_sapi_name() == 'cli'){
    $_SERVER['REQUEST_METHOD'] = 'POST';
    // Simulate POST data from command line args
    parse_str(file_get_contents('php://stdin'), $_POST);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON input if content type is application/json
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $postData = json_decode(file_get_contents('php://input'), true);
    } else {
        $postData = $_POST;
    }
    
    $gameID = $conn->real_escape_string(trim($postData['gameID']));
    $act = $postData["action"];
    $bets = $postData["bet"];

    if ($act == "start"){
        $result = startGame($conn, $gameID, $bets);
        echo json_encode($result); // Add this line to output the JSON response
    }
    else{
        echo json_encode(['error' => 'Unknown action']); // Fix this line to properly encode as JSON
    }
}

function startGame($conn, $gameID, $bets) {
    // Check if there are at least 2 players
    $checkPlayersQuery = "SELECT playerList FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($checkPlayersQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['error' => 'Game not found'];
    }
    
    $row = $result->fetch_assoc();
    $playerList = json_decode($row['playerList'], true);
    
    if (count($playerList) <= 2) {
        return ['error' => 'Need at least 2 players to start'];
    }
    
    // Generate a deck of cards based on your card format
    $deck = generateDeck();
    
    // Shuffle the deck
    shuffle($deck);
    
    // Deal 7 cards to each player and update database
    foreach ($playerList as $playerID) {
        // Draw 7 cards for the player
        $playerCards = array_splice($deck, 0, 7);
        
        // Convert cards array to JSON format matching your database
        $cardsJSON = json_encode($playerCards);
        
        // Check if player already exists in the player table
        $checkPlayerQuery = "SELECT * FROM players WHERE playerID = ? AND gameID = ?";
        $stmt = $conn->prepare($checkPlayerQuery);
        $stmt->bind_param("ss", $playerID, $gameID);
        $stmt->execute();
        $playerResult = $stmt->get_result();
        
        // Get player name from your users table
        $playerName = getPlayerName($conn, $playerID);
        
        if ($playerResult->num_rows > 0) {
            // Update existing player record
            $updatePlayerQuery = "UPDATE players SET cardList = ? WHERE playerID = ? AND gameID = ?";
            $stmt = $conn->prepare($updatePlayerQuery);
            $stmt->bind_param("sss", $cardsJSON, $playerID, $gameID);
            $stmt->execute();
        } else {
            // Insert new player record
            $insertPlayerQuery = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games) 
                                 VALUES (?, ?, ?, ?, NULL, 0, 0, 0)";
            $stmt = $conn->prepare($insertPlayerQuery);
            $stmt->bind_param("ssss", $gameID, $playerID, $playerName, $cardsJSON);
            $stmt->execute();
        }
    }
    
    // Get the top card from the remaining deck to serve as the starting card
    $currentCard = array_shift($deck);
    
    // Get the first player in the playerList to start the game
    $currentPlayer = $playerList[0];
    
    // Store the remaining deck in the player table under username "deck"
    $deckJSON = json_encode($deck);
    
    // Check if deck entry already exists in player table
    $checkDeckQuery = "SELECT * FROM players WHERE playerID = 'deck' AND gameID = ?";
    $stmt = $conn->prepare($checkDeckQuery);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $deckResult = $stmt->get_result();
    
    if ($deckResult->num_rows > 0) {
        // Update existing deck record
        $updateDeckQuery = "UPDATE players SET cardList = ? WHERE playerID = 'deck' AND gameID = ?";
        $stmt = $conn->prepare($updateDeckQuery);
        $stmt->bind_param("ss", $deckJSON, $gameID);
        $stmt->execute();
    } else {
        // Insert new deck record
        $insertDeckQuery = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games) 
                           VALUES (?, 'deck', 'Deck', ?, NULL, 0, 0, 0)";
        $stmt = $conn->prepare($insertDeckQuery);
        $stmt->bind_param("ss", $gameID, $deckJSON);
        $stmt->execute();
    }
    
    
    // Update the lobby table with the current card, current player, and game status
    $updateLobbyQuery = "UPDATE lobby SET curCard = ?, curPlayer = ?, gameStatus = 'inProgress' WHERE gameID = ?";
    $stmt = $conn->prepare($updateLobbyQuery);
    
    // Convert the currentCard to JSON if it's not already a string
    $currentCardJson = is_string($currentCard) ? $currentCard : json_encode($currentCard);
    
    $stmt->bind_param("sss", $currentCardJson, $currentPlayer, $gameID);
    $stmt->execute();
    
    return ['success' => true, 'message' => 'Game started with cards dealt to all players'];
}

/**
 * Generate a complete deck of cards matching your format
 * Based on your database example, cards appear to be in format like "color_value"
 */
function generateDeck() {
    $colors = ['red', 'blue', 'green', 'yellow', 'wild'];
    $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $specials = ['skip', 'reverse'];
    
    $deck = [];
    
    // Add numbered cards (0-9) for each color
    // Note: Usually there's only one '0' per color but two of each 1-9
    foreach ($colors as $color) {
        // Add one '0' card per color
        $deck[] = "{$color}_0";
        
        // Add two of each 1-9 card per color
        foreach ($values as $value) {
            if ($value !== '0' && $color !== 'wild') { // Skip 0 since we already added it
                $deck[] = "{$color}_{$value}";
                $deck[] = "{$color}_{$value}";
            }
        }
        
    }
    
    // Add wild cards (4 of each type

    return $deck;
}

/**
 * Get player name from username in the users table
 * Based on your database structure showing username as the identifier
 */
function getPlayerName($conn, $username) {
    // Since playerID appears to be the username directly based on your DB structure
    $query = "SELECT username FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['username'];
    }
    
    // Return the username as fallback if not found in database
    return $username;
}

function removeMoney($conn, $playerList, $bets){
    for($x= 1; $x < count($playerList); $x++){
        $query = "UPDATE users SET betting_amt = ? WHERE username = ?";
        $stmt = $conn->prepare($query);

        $money = 
        $stmt->bind_param("ds", $money, $playerList[$x]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row['username'];
        }
    }
    // Return the username as fallback if not found in database
    return $username;
}
?>