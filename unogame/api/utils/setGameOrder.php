<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database configuration
$host   = "localhost";
$user   = "kurianva";
$pass   = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Parse incoming POST data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST; // fallback to form-data
}

// Validate action and required parameters
if (isset($data['action']) && $data['action'] === 'setGameOrder') {
    $gameID   = isset($data['gameID']) ? trim($data['gameID']) : '';
    $gameOrder = isset($data['gameOrder']) ? trim($data['gameOrder']) : '';

    if (empty($gameID) || empty($gameOrder)) {
        echo json_encode(["status" => "error", "message" => "Missing required parameters"]);
        exit();
    }

    // Convert the incoming string "A,B,C,D" into a PHP array
    $cards = array_map('trim', explode(",", $gameOrder));
    
    // Encode the PHP array as a JSON array to store in the database
    $cardsJSON = json_encode($cards);

    // Prepare and execute the update query
    $stmt = $conn->prepare("UPDATE lobby SET gameOrder = ? WHERE gameID = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Statement preparation failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("ss", $cardsJSON, $gameID);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Game Order updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed or no change made"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

$conn->close();
?>
