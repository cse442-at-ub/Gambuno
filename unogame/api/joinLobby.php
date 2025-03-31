<?php
header('Content-Type: application/json');
include 'db_connection.php'; // Ensure this file sets up your $conn variable

// Get the raw POST data and decode it as JSON
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is valid and required keys exist
if (!$data || !isset($data['gameID']) || !isset($data['playerName'])) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Invalid data provided. Expected gameID and playerName.'
    ]);
    exit;
}

// Sanitize input data
$gameID = mysqli_real_escape_string($conn, $data['gameID']);
$playerName = mysqli_real_escape_string($conn, $data['playerName']);

// Generate a unique playerID (you can adjust the logic as needed)
$playerID = uniqid('player_', true);

// Prepare an INSERT query to add the new player into the players table
// Note: The players table expects cardList as a JSON array string, placedCard as empty string,
// skipped as 0 (false), wins and total_games as 0.
$query = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games) 
          VALUES ('$gameID', '$playerID', '$playerName', '[]', '', 0, 0, 0)";

$result = mysqli_query($conn, $query);

if ($result) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database error: ' . mysqli_error($conn)
    ]);
}
?>
