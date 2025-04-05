<?php

const API_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/';

include 'gameLogic.php';

header("Content-Type: application/json");

/**
 * Sends a test request to the API.
 */
function sendTestRequest($action, $params = []) {
    $url = API_URL . "test_util.php?action=" . urlencode($action) . "&" . http_build_query($params);
    
    // Fetch response
    $response = @file_get_contents($url);
    
    // Error handling if request fails
    if ($response === FALSE) {
        return ['success' => false, 'message' => "Failed to fetch response for action: $action"];
    }

    return json_decode($response, true) ?: ['success' => false, 'message' => 'Invalid JSON response'];
}

// Retrieve GET parameters safely
$action = $_GET['action'] ?? null;
$gameID = $_GET['gameID'] ?? null;
$lobbyID = $_GET['lobbyID'] ?? null;
$username = $_GET['username'] ?? null;
$playerID = $_GET['playerID'] ?? null;
$newCardList = $_GET['newCardList'] ?? null;
$newCard = $_GET['newCard'] ?? null;
$newGameStatus = $_GET['newGameStatus'] ?? null;
$newMoney = $_GET['newMoney'] ?? null;

// Define test cases
$tests = [
    "getBettingAmount" => ["gameID" => $gameID],
    "getCurrentCard" => ["gameID" => $gameID],
    "getCurrentPlayer" => ["lobbyID" => $lobbyID],
    "getGame" => ["gameID" => $gameID],
    "getHost" => ["gameID" => $gameID],
    "getMoney" => ["username" => $username],
    "getPlayerCardList" => ["playerID" => $playerID],
    "getPlayerList" => ["playerID" => $playerID],
    "getPlayerName" => ["playerID" => $playerID],
    "getPlayers" => ["lobbyID" => $lobbyID],
    "setCardList" => ["gameID" => $gameID, "playerID" => $playerID, "newCardList" => $newCardList],
    "setCurrentCard" => ["gameID" => $gameID, "newCard" => $newCard],
    "setGameStatus" => ["gameID" => $gameID, "newGameStatus" => $newGameStatus],
    "setHost" => ["gameID" => $gameID, "playerID" => $playerID],
    "setMoney" => ["playerID" => $playerID, "newMoney" => $newMoney],
    "updatePlayerWins" => ["playerID" => $playerID, "gameID" => $gameID]
];

// Run tests and output results
foreach ($tests as $testAction => $params) {
    if (in_array(null, $params, true)) {
        echo "Skipping test for $testAction due to missing parameters.\n";
        continue;
    }

    echo "Testing $testAction:\n";
    print_r(sendTestRequest($testAction, $params));
    echo "\n----------------------\n";
}

?>
