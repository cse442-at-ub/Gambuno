<?php
// joinLobby.php
error_reporting(0);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Ensure the request method is POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Retrieve the JSON payload.
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

// Ensure required parameters are present.
if (!isset($data['gameID']) || !isset($data['playerName'])) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

$gameID = $data['gameID'];
$playerName = $data['playerName'];

// Database connection parameters – update these with your actual credentials.
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Use prepared statement for insertion.
$stmt = $conn->prepare("INSERT INTO players (gameID, playerName, ready) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$ready = 0; // 0 for not ready
$stmt->bind_param("ssi", $gameID, $playerName, $ready);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database insertion failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
