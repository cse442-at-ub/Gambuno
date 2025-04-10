<?php

function curlRequest($url, $method = 'GET', $data = null) {
    $ch = curl_init();

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'GET' && $data) {
        $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

const API_URL = 'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/utils/';

// Test placeCard
$response = curlRequest(API_URL . 'gameLogic.php', 'POST', [
    'action' => 'place_card',
    'gameID' => '1B1P8A',
    'playerID' => 'player_1284',
    'card' => 'blue_3'
]);
echo "placeCard: ";
print_r(json_decode($response, true));
echo "\n";

// Test drawCard
$response = curlRequest(API_URL . 'gameLogic.php', 'POST', [
    'action' => 'draw_card',
    'gameID' => '1B1P8A',
    'playerID' => 'player_1284'
]);
echo "drawCard: ";
print_r(json_decode($response, true));
echo "\n";

// Test getGameState
$response = curlRequest(API_URL . 'gameLogic.php', 'GET', [
    'action' => 'get_game_state',
    'gameID' => '1B1P8A',
    'playerID' => 'player_1284'
]);
echo "getGameState: ";
print_r(json_decode($response, true));
echo "\n";

?>