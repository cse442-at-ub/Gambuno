<?php
header('Content-Type: application/json');
include 'db_connection.php'; // Ensure this file sets up your $conn variable

// Check if connection failed
if (!$conn) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database connection failed: ' . $db_error
    ]);
    exit;
}


// Get the raw POST data and decode it as JSON
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

if (!$data || !isset($data['gameID']) || !isset($data['playerName'])) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Invalid data provided. Expected gameID and playerName.'
    ]);
    exit;
}

// Trim and sanitize input values
$gameID = trim(mysqli_real_escape_string($conn, $data['gameID']));
$playerName = trim(mysqli_real_escape_string($conn, $data['playerName']));

// Generate a unique playerID
$playerID = uniqid('player_', true);

// Insert a new player record into the players table
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
exit;
?>
