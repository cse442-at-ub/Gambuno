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

// Handle getWaitingLobbies action
if (isset($_GET['action']) && $_GET['action'] === 'getWaitingLobbies') {
    $query = "SELECT gameID, playerList, gameStatus, betting_amt FROM lobby WHERE gameStatus = 'waiting'";
    $result = $conn->query($query);

    $lobbies = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            // Ensure that playerList is a valid JSON array
            if ($row['playerList'] === 'null' || $row['playerList'] === null) {
                $row['playerList'] = '[]';
            }
            $lobbies[] = $row;
        }
    }

    echo json_encode(["status" => "success", "lobbies" => $lobbies]);
    $conn->close();
    exit;
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
    $conn->close();
    exit;
}
?>
