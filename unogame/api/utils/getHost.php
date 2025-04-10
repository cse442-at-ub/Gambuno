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
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if (isset($_GET['action']) && $_GET['action'] === 'getHost') {
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';

    // Prepare and execute the query to get the current player
    $stmt = $conn->prepare("SELECT host FROM lobby WHERE gameID = ?");
    if (!$stmt) {
        die(json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "currentPlayer" => $row['host']]);
    } else {
        echo json_encode(["status" => "error", "message" => "No current player found or query failed."]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);

}
