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

    function getCurrentCard($gameID) {
        $url = API_URL . "getCurrentCard.php?action=getCurrentCard&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getCurrentPlayer($lobbyID) {
        $url = API_URL . "getCurrentPlayer.php?action=getCurrentPlayer&lobbyID=$lobbyID";
        return callApi($url, 'GET');
    }

    function getGame($gameID) {
        $url = API_URL . "getGame.php?action=getGame&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getHost($gameID) {
        $url = API_URL . "getHost.php?action=getHost&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getMoney($username) {
        $url = API_URL . "getMoney.php?action=getMoney&username=$username";
        return callApi($url, 'GET');
    }

    function getPlayerCardList($playerID) {
        $url = API_URL . "getPlayerCardList.php?action=getPlayerCardList&playerID=$playerID";
        return callApi($url, 'GET');
    }

    function getPlayerList($playerID) {
        $url = API_URL . "getPlayerList.php?action=getPlayerList&playerID=$playerID";
        return callApi($url, 'GET');
    }

    function getPlayerName($playerID) {
        $url = API_URL . "getPlayerName.php?action=getPlayerName&playerID=$playerID";
        return callApi($url, 'GET');
    }

    function getPlayers($lobbyID) {
        $url = API_URL . "getPlayers.php?action=getPlayers&lobbyID=$lobbyID";
        return callApi($url, 'GET');
    }

    function setCardList($gameID, $playerID, $newCardList) {
        $url = API_URL . "setCardList.php";
        $data = [
            'action' => 'setCardList',
            'gameID' => $gameID,
            'playerID' => $playerID,
            'cardList' => $newCardList
        ];
        return callApi($url, 'POST', $data);
    }
    function setCurrentPlayer($gameID, $playerID) {
        $url = API_URL . "setCurrentPlayer.php";
        $data = [
            'action' => 'setCurrentPlayer',
            'gameID' => $gameID,
            'playerID' => $playerID
        ];
        return callApi($url, 'POST', $data);
    }

    function setCurrentCard($gameID, $card) {
        $url = API_URL . "setCurrentCard.php";
        $data = [
            'action' => 'setCurrentCard',
            'gameID' => $gameID,
            'card' => $card
        ];
        return callApi($url, 'POST', $data);
    }

    function setGameStatus($gameID, $gameStatus) {
        $url = API_URL . "setGameStatus.php";
        $data = [
            'action' => 'setGameStatus',
            'gameID' => $gameID,
            'gameStatus' => $gameStatus
        ];
        return callApi($url, 'POST', $data);
    }

    function setHost($gameID, $playerID) {
        $url = API_URL . "setHost.php";
        $data = [
            'action' => 'setHost',
            'gameID' => $gameID,
            'playerID' => $playerID
        ];
        return callApi($url, 'POST', $data);
    }

    function setMoney($playerID, $newMoney) {
        $url = API_URL . "setMoney.php";
        $data = [
            'action' => 'setMoney',
            'playerID' => $playerID,
            'newMoney' => $newMoney
        ];
        return callApi($url, 'POST', $data);
    }

    function updatePlayerWins($playerID, $gameID) {
        $url = API_URL . "updatePlayerWins.php";
        $data = [
            'action' => 'updatePlayerWins',
            'playerID' => $playerID,
            'gameID' => $gameID
        ];
        return callApi($url, 'POST', $data);
    }
    
    function getCookies(){
        if (isset($_COOKIE['auth'])){
            $cookie = $_COOKIE['auth'];
            return $cookie;
        }
    }
    
    if (isset($_GET['action']) && $_GET['action'] == 'cookie') {
        $userVal = getCookies();
        echo json_encode(["status" => true, "cookie" => $userVal]);
        exit;
    }

    function updatePlayersStats($gameID, $winnerID) {
        $url = API_URL . "updatePlayersStats.php";
        $data = [
            'action' => 'updatePlayersStats',
            'gameID' => $gameID,
            'winnerID' => $winnerID
        ];
        return callApi($url, 'POST', $data);
    }

    ?>
