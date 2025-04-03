<?php

function getPlayers($conn, $lobbyID)
{
    $stmt = $conn->prepare("SELECT * FROM Player WHERE lobbyID = ?");
    $stmt->bind_param("s", $lobbyID);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function getPlayerCardList($conn, $playerID)
{
    $stmt = $conn->prepare("SELECT CardList FROM Player WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc()["CardList"];
}

function getMoney($conn, $playerID){
    $stmt = $conn->prepare("SELECT money FROM users WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['money']; // Return the money value
    }
    return 0;
}

function getPlayerName($conn, $playerID){
    $stmt = $conn->prepare("SELECT playerName FROM players WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    $stmt->execute();
    return $stmt->get_result();
}

function getCurrentPlayer($conn, $gameID){
    $stmt = $conn->prepare("SELECT curPlayer FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID)
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['curPlayer']; 
    }
    return null; 
}

function getCurrentCard($conn, $gameID){
    $stmt = $conn->prepare("SELECT curCard FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['curCard'];
    }
    
    return null;
}
function getCardList($conn, $gameID,$playerID){
    $stmt = $conn->prepare("SELECT cardList FROM players WHERE playerID = ?");
    $stmt->bind_param("ss", $playerID, $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['cardList']; 
    }
}

function getPlayerList($conn,$gameID){
    $stmt = $conn->prepare("SELECT playerList FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['playerList']; 
    }
    
    return "";
}
function getBettingAmount($conn, $gameID) {
    $query = "SELECT betting_amt FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['betting_amt'];
    }
    
    return 0;
}

function setPlacedCard($conn, $gameID, $playerID, $card){
    $stmt = $conn->prepare("UPDATE players SET placedCard = ? WHERE playerID = ? AND gameID = ?");
    $stmt->bind_param("sss", $card, $playerID, $gameID);
    return $stmt->execute();
}

function setCardList($conn, $gameID, $playerID, $newCardList){
    $stmt = $conn->prepare("UPDATE players SET cardList = ? WHERE playerID = ? AND gameID = ?");
    $stmt->bind_param("sss", $newCardList, $playerID, $gameID);
    return $stmt->execute();
}

function setCurrentCard($conn, $gameID, $card){
    $stmt = $conn->prepare("UPDATE lobby SET curCard = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $card, $gameID);
    return $stmt->execute();
}

function setGameStatus($conn, $gameID, $gameStatus){
    $allowedStatuses = ["finished", "waiting", "inProgress"];
    if (!in_array($gameStatus, $allowedStatuses)) {
        return false;
    }
    $stmt = $conn->prepare("UPDATE lobby SET status = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $gameStatus, $gameID);
    return $stmt->execute();
}
function setMoney($conn, $playerID, $newMoney){
    $stmt = $conn->prepare("UPDATE players SET money = ? WHERE playerID = ?");
    $stmt->bind_param("sd", $playerID, $newMoney);
    return $stmt->execute();
}

function setCurrentPlayer($conn, $gameID, $newCurPlayer){
    $stmt = $conn->prepare("SELECT curPlayer FROM lobby WHERE gameID = ?");
    $stmt->bind_param("ss", $gameID, $newCurPlayer)
    return $stmt->execute();
}
function updatePlayerWins($conn,$gameID, $playerID){
    $stmt = $conn->prepare("UPDATE players SET wins = wins + 1 WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    return $stmt->execute();
}

function updatePlayersStats($conn,$gameID, $playerID) {
    $stmt = $conn->prepare("UPDATE players SET total= total+ 1 WHERE playerID = ?");
    $stmt->bind_param("s", $playerID);
    return $stmt->execute();
}


function updatePlayerCardList($conn, $playerID, $newCardList)
{
    $stmt = $conn->prepare("UPDATE Player SET CardList = ? WHERE playerID = ?");
    $stmt->bind_param("ss", $newCardList, $playerID);
    return $stmt->execute();
}

function updatePlacedCard($conn, $playerID, $card)
{
    $stmt = $conn->prepare("UPDATE Player SET PlacedCard = ? WHERE playerID = ?");
    $stmt->bind_param("ss", $card, $playerID);
    return $stmt->execute();
}

function updateSkipStatus($conn, $playerID, $skipStatus)
{
    $stmt = $conn->prepare("UPDATE Player SET Skip = ? WHERE playerID = ?");
    $stmt->bind_param("is", $skipStatus, $playerID);
    return $stmt->execute();
}

function updateGameOrder($conn, $lobbyID, $newOrder)
{
    $stmt = $conn->prepare("UPDATE Lobby SET GameOrder = ? WHERE lobbyID = ?");
    $stmt->bind_param("ss", $newOrder, $lobbyID);
    return $stmt->execute();
}

function updateCurrentCard($conn, $lobbyID, $card)
{
    $stmt = $conn->prepare("UPDATE Lobby SET CurrentCard = ? WHERE lobbyID = ?");
    $stmt->bind_param("ss", $card, $lobbyID);
    return $stmt->execute();
}

function updateCurrentPlayer($conn, $lobbyID, $playerID)
{
    $stmt = $conn->prepare("UPDATE Lobby SET CurrentPlayer = ? WHERE lobbyID = ?");
    $stmt->bind_param("ss", $playerID, $lobbyID);
    return $stmt->execute();
}

function updateCardEffect($conn, $playerID, $effect)
{
    $stmt = $conn->prepare("UPDATE Player SET CardEffect = ? WHERE playerID = ?");
    $stmt->bind_param("ss", $effect, $playerID);
    return $stmt->execute();
}


function getDatabaseConnection()
{
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

