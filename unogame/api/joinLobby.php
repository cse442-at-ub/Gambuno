<?php
header('Content-Type: application/json');
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

// Get the player's authToken from cookies
if (!isset($_COOKIE['authToken']) || empty($_COOKIE['authToken'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Authentication token is missing.'
    ]);
    exit;
}

$authToken = $_COOKIE['authToken'];
$hashedToken = hash('sha256', $authToken); // Hash the auth token before using it

// Fetch the player's ID and name using the hashed authToken
$query = "SELECT playerID, playerName FROM players WHERE authTokenHash = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $hashedToken);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Player not found. Ensure you are logged in.'
    ]);
    exit;
}

$row = $result->fetch_assoc();
$playerID = $row['playerID'];
$playerName = $row['playerName'];
$stmt->close();

// Get the raw POST data and decode it as JSON
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

// Validate input
if (!$data || empty($data['gameID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid data provided. Expected gameID.'
    ]);
    exit;
}

// Trim and sanitize input values
$gameID = trim(mysqli_real_escape_string($conn, $data['gameID']));

// Prepare and execute a safe SQL statement to insert/update player in the game
$query = "INSERT INTO players (gameID, playerID, playerName, cardList, placedCard, skipped, wins, total_games, authTokenHash) 
          VALUES (?, ?, ?, '[]', '', 0, 0, 0, ?)
          ON DUPLICATE KEY UPDATE gameID = VALUES(gameID)";

$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $gameID, $playerID, $playerName, $hashedToken);

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
