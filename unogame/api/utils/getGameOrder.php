<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Database configuration
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Validate request
if (isset($_GET['action']) && $_GET['action'] === 'getGameOrder') {
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';

    
    if (empty($gameID)) {
        echo json_encode(["status" => "error", "message" => "Missing No Player Order"]);
        exit();
    }

    // Prepare statement
    $stmt = $conn->prepare("SELECT gameOrder FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();

    // Fetch results
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        echo json_encode(["status" => "error", "message" => "Order not found"]);
    } else {
        echo json_encode(["status" => "success", "gameOrder" => json_decode($result["gameOrder"])]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

// Close the connection
$conn->close();
?>
