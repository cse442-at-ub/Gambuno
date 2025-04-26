<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Database configuration (Consider using environment variables for production)
$host   = "localhost";
$user   = "kurianva";
$pass   = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Handle getPlayerName action
if (isset($_GET['action']) && $_GET['action'] === 'getPlayerName') {
    // Retrieve and sanitize the playerID parameter
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';

    $playerID = isset($_GET['playerID']) ? trim($_GET['playerID']) : '';

    // Check if playerID is provided
    if (empty($playerID) || empty($gameID)) {
        echo json_encode(["status" => "error", "message" => "playerID not provided OR gameID not provided"]);
        $conn->close();
        exit;
    }

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT playerName FROM players WHERE gameID = ? AND playerID = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement"]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("ss", $gameID, $playerID);
    $stmt->execute();
    $result = $stmt->get_result();

    // Output the result as a JSON array
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));

    $stmt->close();
}

$conn->close();
?>
