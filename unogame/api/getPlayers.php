<?php
// Disable error reporting in production or log errors appropriately.
error_reporting(0);
header("Content-Type: application/json");

// Ensure the request method is GET.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Validate that gameID is provided.
if (!isset($_GET['gameID']) || empty($_GET['gameID'])) {
    echo json_encode(["status" => "error", "message" => "Missing gameID"]);
    exit;
}

$gameID = $_GET['gameID'];

// Database connection parameters – update these with your actual credentials.
$host     = "your_db_host";
$user     = "your_db_user";
$password = "your_db_password";
$database = "your_db_name";

// Create connection using MySQLi.
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Query to retrieve players for the given gameID.
// Adjust table name and column names as per your database schema.
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
