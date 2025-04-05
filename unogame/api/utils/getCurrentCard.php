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

// Handle getCurrentCard action
if (isset($_GET['action']) && $_GET['action'] === 'getCurrentCard') {
    $gameID = $_GET['gameID'];
    $stmt = $conn->prepare("SELECT curCard FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["status" => "success", "curCard" => $row['curCard']]);
    } else {
        echo json_encode(["status" => "error", "message" => "No current card found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

$conn->close();
?>