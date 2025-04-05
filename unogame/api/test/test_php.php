<?php
const API_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/';

include 'util.php';

header("Content-Type: application/json");

$action = $_GET['action'] ?? null;
$gameID = $_GET['gameID'] ?? null;
$lobbyID = $_GET['lobbyID'] ?? null;
$username = $_GET['username'] ?? null;
$playerID = $_GET['playerID'] ?? null;
$newCardList = $_GET['newCardList'] ?? null;
$newCard = $_GET['newCard'] ?? null;
$newGameStatus = $_GET['newGameStatus'] ?? null;
$newMoney = $_GET['newMoney'] ?? null;

$response = ['success' => false, 'message' => 'Invalid action'];

switch ($action) {
    case 'getBettingAmount':
        $response = getBettingAmount($gameID);
        break;
    case 'getCurrentCard':
        $response = getCurrentCard($gameID);
        break;
    case 'getCurrentPlayer':
        $response = getCurrentPlayer($lobbyID);
        break;
    case 'getGame':
        $response = getGame($gameID);
        break;
    case 'getHost':
        $response = getHost($gameID);
        break;
    case 'getMoney':
        $response = getMoney($username);
        break;
    case 'getPlayerCardList':
        $response = getPlayerCardList($playerID);
        break;
    case 'getPlayerList':
        $response = getPlayerList($playerID);
        break;
    case 'getPlayerName':
        $response = getPlayerName($playerID);
        break;
    case 'getPlayers':
        $response = getPlayers($lobbyID);
        break;
    case 'setCardList':
        $response = setCardList($gameID, $playerID, $newCardList);
        break;
    case 'setCurrentCard':
        $response = setCurrentCard($gameID, $newCard);
        break;
    case 'setGameStatus':
        $response = setGameStatus($gameID, $newGameStatus);
        break;
    case 'setHost':
        $response = setHost($gameID, $playerID);
        break;
    case 'setMoney':
        $response = setMoney($playerID, $newMoney);
        break;
    case 'updatePlayerWins':
        $response = updatePlayerWins($playerID, $gameID);
        break;
}

echo json_encode($response);
?>