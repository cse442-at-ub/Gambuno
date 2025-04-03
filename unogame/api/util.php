<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (isset($_GET['action']) && $_GET['action'] == 'cookie') {
    $userVal = getCookies();
    echo json_encode(["status" => true, "cookie" => $userVal]);
    exit;
}

function getPlayers($conn, $lobbyID)
{
    $stmt = $conn->prepare("SELECT * FROM Player WHERE lobbyID = ?");
    $stmt->bind_param("i", $lobbyID);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function getPlayerCardList($conn, $playerID)
{
    $stmt = $conn->prepare("SELECT CardList FROM Player WHERE playerID = ?");
    $stmt->bind_param("i", $playerID);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc()["CardList"];
}

function updatePlayerCardList($conn, $playerID, $newCardList)
{
    $stmt = $conn->prepare("UPDATE Player SET CardList = ? WHERE playerID = ?");
    $stmt->bind_param("si", $newCardList, $playerID);
    return $stmt->execute();
}

function updatePlacedCard($conn, $playerID, $card)
{
    $stmt = $conn->prepare("UPDATE Player SET PlacedCard = ? WHERE playerID = ?");
    $stmt->bind_param("si", $card, $playerID);
    return $stmt->execute();
}

function updateSkipStatus($conn, $playerID, $skipStatus)
{
    $stmt = $conn->prepare("UPDATE Player SET Skip = ? WHERE playerID = ?");
    $stmt->bind_param("ii", $skipStatus, $playerID);
    return $stmt->execute();
}

function updateGameOrder($conn, $lobbyID, $newOrder)
{
    $stmt = $conn->prepare("UPDATE Lobby SET GameOrder = ? WHERE lobbyID = ?");
    $stmt->bind_param("si", $newOrder, $lobbyID);
    return $stmt->execute();
}

function updateCurrentCard($conn, $lobbyID, $card)
{
    $stmt = $conn->prepare("UPDATE Lobby SET CurrentCard = ? WHERE lobbyID = ?");
    $stmt->bind_param("si", $card, $lobbyID);
    return $stmt->execute();
}

function updateCurrentPlayer($conn, $lobbyID, $playerID)
{
    $stmt = $conn->prepare("UPDATE Lobby SET CurrentPlayer = ? WHERE lobbyID = ?");
    $stmt->bind_param("ii", $playerID, $lobbyID);
    return $stmt->execute();
}

function updateCardEffect($conn, $playerID, $effect)
{
    $stmt = $conn->prepare("UPDATE Player SET CardEffect = ? WHERE playerID = ?");
    $stmt->bind_param("si", $effect, $playerID);
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

function getCookies(){
    if (isset($_COOKIE['auth'])){
        $cookie = $_COOKIE['auth'];
        return $cookie;
    }

    
}

