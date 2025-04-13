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

// Handle getBettingAmount action
if (isset($_GET['action']) && $_GET['action'] === 'getCardEffect') {
    // Retrieve and sanitize the gameID parameter
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';
    
    // Check if gameID is provided
    if (empty($gameID)) {
        echo json_encode(["status" => "error", "message" => "gameID not provided"]);
        $conn->close();
        exit;
    }

    // Prepare the SQL statement to prevent SQL injection
    $query = "SELECT cardEffect FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement"]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    // Output the result if a record is found, or return 0 otherwise
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["success" => true, "effect" => $row['cardEffect']]);
    } 
    $stmt->close();
}

$conn->close();
?>
