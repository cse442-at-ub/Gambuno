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

if (isset($_POST['action']) && $_POST['action'] === 'setPlacedCard') {
    $playerID = $_POST['playerID'];
    $gameID = $_POST['gameID'];
    $card = $_POST['card'];

    // Validate input
    if (empty($playerID) || empty($gameID) || empty($card)) {
        echo json_encode(["status" => "error", "message" => "Invalid input."]);
        exit;
    }

    // Update the placed card for the player
    $stmt = $conn->prepare("UPDATE players SET placedCard = ? WHERE playerID = ? AND gameID = ?");
    if (!$stmt) {
        die(json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("sss", $card, $playerID, $gameID);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Placed card updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update placed card: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

