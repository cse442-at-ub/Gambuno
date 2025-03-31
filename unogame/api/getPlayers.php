<?php
// getPlayers.php
error_reporting(0);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Ensure the request method is GET.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Validate the action parameter.
if (!isset($_GET['action']) || $_GET['action'] !== 'getPlayers') {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
    exit;
}

// Validate that gameID is provided.
if (!isset($_GET['gameID']) || empty($_GET['gameID'])) {
    echo json_encode(["status" => "error", "message" => "Missing gameID"]);
    exit;
}

$gameID = $_GET['gameID'];

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

// Query to retrieve players for the given gameID.
$query  = "SELECT playerName, ready FROM players WHERE gameID = '$gameID'";
$result = $conn->query($query);
$players = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
    $result->free();
} else {
    echo json_encode(["status" => "error", "message" => "Query failed"]);
    $conn->close();
    exit;
}

$conn->close();
echo json_encode(["status" => "success", "players" => $players]);
?>
