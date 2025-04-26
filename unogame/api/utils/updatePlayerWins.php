<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database configuration (Consider using environment variables for production)
$host   = "localhost";
$user   = "kurianva";
$pass   = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "status"  => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Retrieve raw POST data if content type is JSON; otherwise, use $_POST
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $postData = json_decode(file_get_contents('php://input'), true);
} else {
    $postData = $_POST;
}

// Handle updatePlayerWins action
if (isset($postData['action']) && $postData['action'] === 'updatePlayerWins') {
    // Retrieve and sanitize the playerID and gameID parameters
    $playerID = isset($postData['playerID']) ? trim($postData['playerID']) : '';
    // Validate required parameters
    if (empty($playerID)) {
        echo json_encode([
            "status"  => "error",
            "message" => "Required parameters (playerID) are missing."
        ]);
        $conn->close();
        exit;
    }

    // Prepare the SQL statement to update wins for the given player and game
    $stmt = $conn->prepare("UPDATE users SET wins = wins + 1 WHERE username = ?");
    if (!$stmt) {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to prepare statement: " . $conn->error
        ]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("s", $playerID);

    // Execute the statement and return a JSON response
    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Player wins updated successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to update player wins: " . $stmt->error
        ]);
    }
    
    $stmt->close();
}

$conn->close();
?>
