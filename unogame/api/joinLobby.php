<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php'; // Ensure this file sets up your $conn variable

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get the raw POST data and decode it as JSON
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

// Validate input
if (!$data || empty($data['gameID']) || empty($data['playerName'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid data provided. Expected gameID and playerName.'
    ]);
    exit;
}

// Sanitize input values
$gameID = trim($conn->real_escape_string($data['gameID']));
$playerName = "name45643";

// Fetch the player's ID using the provided playerName
$query = "SELECT playerID FROM players WHERE playerName = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $playerName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Player not found. Ensure you have registered.'
    ]);
    exit;
}

$row = $result->fetch_assoc();
$playerID = $row['playerID'];
$stmt->close();

// Ensure the game exists
$gameCheckQuery = "SELECT gameID FROM games WHERE gameID = ?";
$gameCheckStmt = $conn->prepare($gameCheckQuery);
$gameCheckStmt->bind_param("s", $gameID);
$gameCheckStmt->execute();
$gameCheckResult = $gameCheckStmt->get_result();

if ($gameCheckResult->num_rows === 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Game not found. Please check the game ID.'
    ]);
    exit;
}
$gameCheckStmt->close();

// Insert the player into the game_players table to link them to the game
$query = "INSERT INTO game_players (gameID, playerID, playerName) 
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE playerName = VALUES(playerName)";

$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $gameID, $playerID, $playerName);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'playerName' => $playerName]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
exit;
?>