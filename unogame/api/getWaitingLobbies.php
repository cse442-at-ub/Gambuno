<?php
// Debug file to fetch all waiting lobbies

// Database connection parameters
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Query to fetch all lobbies with gameStatus = 'waiting'
$query = "SELECT gameID, playerList, gameStatus FROM lobby WHERE gameStatus = 'waiting'";
$result = $conn->query($query);

$lobbies = [];
while ($row = $result->fetch_assoc()) {
    $lobbies[] = $row;
}

echo json_encode($lobbies);

// Close the database connection
$conn->close();
?>
