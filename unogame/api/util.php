<?php
const API_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/';

    function callApi($url, $method, $data = null) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        }

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    function getBettingAmount($gameID) {
        $url = API_URL . "getBettingAmount.php?action=getBettingAmount&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getCurrentCard($gameID) {
        $url = API_URL . "getCurrentCard.php?action=getCurrentCard&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getCurrentPlayer($gameID) {
        $url = API_URL . "getCurrentPlayer.php?action=getCurrentPlayer&gameID=$gameID";
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

    function getCardList($playerID, $gameID) {
        $url = API_URL . "getPlayerCardList.php?action=getPlayerCardList&playerID=$playerID&gameID=$gameID";
        return callApi($url, 'GET');
    }

    function getTotalGame($username) {
        $url = API_URL . "getTotalGame.php?action=getTotalGame&username=$username";
        return callApi($url, 'GET');
    }

    function getWins($username) {
        $url = API_URL . "getWins.php?action=getWins&username=$username";
        return callApi($url, 'GET');
    }

    function getPlayerList($playerID) {
        $url = API_URL . "getPlayerList.php?action=getPlayerList&gameID=$playerID";
        return callApi($url, 'GET');
    }
    function getGameOrder($gameID){
        $url = API_URL . "getGameOrder.php?action=getGameOrder&gameID=$gameID";
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

    function getCardEffect($gameID) {
        $url = API_URL . "getCardEffect.php?action=getCardEffect&gameID=$gameID";
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
    function setPlacedCard ($gameID, $playerID, $card){
        $url = API_URL . "setPlacedCard.php";
        $data = [
            'action' => 'setPlacedCard',
            'gameID' => $gameID,
            'playerID' => $playerID,
            'card' => $card
        ];
        return callApi($url, 'POST', $data);
    }

    function setTotalGame($username, $val){
        $url = API_URL . "setTotalGame.php";
        $data = [
            'action' => 'setTotalGame',
            'username' => $username,
            'val' => $val
        ];
        return callApi($url, 'POST', $data);
    }

    function setWins($username, $val){
        $url = API_URL . "setWins.php";
        $data = [
            'action' => 'setWins',
            'username' => $username,
            'win' => $val
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

    function setCardEffect($gameID, $effect) {
        $url = API_URL . "setCardEffect.php";
        $data = [
            'action' => 'setCardEffect',
            'gameID' => $gameID,
            'fx' => $effect
        ];
        return callApi($url, 'POST', $data);
    }

    function setGameOrder($gameID, $gameOrder) {
        $url = API_URL . "setGameOrder.php";
        $data = [
            'action' => 'setGameOrder',
            'gameID' => $gameID,
            'gameOrder' => $gameOrder
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