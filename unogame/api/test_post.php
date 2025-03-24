<?php
// URL of the POST handler
$url = "http://localhost/uno_game/POST.php";

// Data to send in the POST request
$data = [
    "gameID" => "game123",
    "playerID" => "player1",
    "placedCard" => "red_5"
];

// Initialize cURL
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo "cURL error: " . curl_error($ch);
} else {
    // Print the response
    echo $response;
}

// Close cURL
curl_close($ch);
?>