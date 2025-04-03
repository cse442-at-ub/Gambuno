<?php
function getDatabaseConnection() {
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";
    $dbname = "cse442_2025_spring_team_c_db";

    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Money operations
function getMoney($conn, $playerID) {
    $stmt = $conn->prepare("SELECT money FROM users WHERE username = ?");
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc()['money'] ?? 0.0;
}

function setMoney($conn, $playerID, $newMoney) {
    $stmt = $conn->prepare("UPDATE users SET money = ? WHERE username = ?");
    $stmt->bind_param("ds", $newMoney, $playerID);
    return $stmt->execute();
}

// Player info
function getPlayerName($conn, $playerID) {
    $stmt = $conn->prepare("SELECT playerName FROM players WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc()['playerName'] ?? '';
}

// Card list operations
function getCardList($conn, $gameID, $playerID) {
    $stmt = $conn->prepare("SELECT cardList FROM players WHERE gameID = ? AND playerID = ?");
    $stmt->bind_param("ss", $gameID, $playerID);
    $stmt->execute();
    $result = $stmt->get_result();
    $cardList = $result->fetch_assoc()['cardList'] ?? '';
    
    // Attempt to decode as JSON
    $decoded = json_decode($cardList, true);
    if (is_array($decoded)) {
        // If decoding was successful and we have an array, join the elements with commas.
        return implode(',', $decoded);
    }
    
    // Otherwise, return the original string
    return $cardList;
}


function setCardList($conn, $gameID, $playerID, $cardList) {
    // Convert the comma-separated string into an array,
    // trimming any extra spaces around each element.
    $cardListArray = array_map('trim', explode(',', $cardList));

    // Encode the array as a JSON string for storage.
    $jsonCardList = json_encode($cardListArray);

    // Prepare the SQL update statement.
    $stmt = $conn->prepare("UPDATE players SET cardList = ? WHERE gameID = ? AND playerID = ?");
    $stmt->bind_param("sss", $jsonCardList, $gameID, $playerID);
    return $stmt->execute();
}


// Game state operations
function getCurrentCard($conn, $gameID) {
    $stmt = $conn->prepare("SELECT curCard FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc()['curCard'] ?? '';
}

function setCurrentCard($conn, $gameID, $card) {
    $stmt = $conn->prepare("UPDATE lobby SET curCard = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $card, $gameID);
    return $stmt->execute();
}

function getCurrentPlayer($conn, $gameID) {
    $stmt = $conn->prepare("SELECT curPlayer FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc()['curPlayer'] ?? '';
}

function setCurrentPlayer($conn, $gameID, $player) {
    $stmt = $conn->prepare("UPDATE lobby SET curPlayer = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $player, $gameID);
    return $stmt->execute();
}

// Lobby operations
function getPlayerList($conn, $gameID) {
    $stmt = $conn->prepare("SELECT playerList FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    $playerList = $result->fetch_assoc()['playerList'] ?? '';
    
    // Attempt to decode as JSON
    $decoded = json_decode($playerList, true);
    if (is_array($decoded)) {
        // If decoding was successful and we have an array, join the elements with commas.
        return implode(',', $decoded);
    }
    
    // Otherwise, return the original string
    return $playerList;
}

function getBettingAmount($conn, $gameID) {
    $stmt = $conn->prepare("SELECT betting_amt FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc()['betting_amt'] ?? 0.0;
}

function setPlacedCard($conn, $gameID, $playerID, $card) {
    $stmt = $conn->prepare("UPDATE players SET placedCard = ? WHERE gameID = ? AND playerID = ?");
    $stmt->bind_param("sss", $card, $gameID, $playerID);
    return $stmt->execute();
}

function setGameStatus($conn, $gameID, $gameStatus) {
    $stmt = $conn->prepare("UPDATE lobby SET gameStatus = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $gameStatus, $gameID);
    return $stmt->execute();
}
?>