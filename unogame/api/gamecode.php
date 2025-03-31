<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json');

// Database credentials
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Generate a unique game code
function generateGameCode($length = 6) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }
    echo json_encode(["success" => true, "message" => $code]);
}

// Check for uniqueness and insert
$attempts = 0;
$maxAttempts = 10;
$gameCode = null;

while ($attempts < $maxAttempts) {
    $code = generateGameCode();

    // Check if the code already exists
    $stmt = $conn->prepare("SELECT gameID FROM lobby WHERE gameID = ?");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        // Code is unique, insert into lobby with initial empty values
        $emptyJSON = json_encode([]);
        $stmtInsert = $conn->prepare("INSERT INTO lobby (gameID, curCard, curPlayer, cardEffect, playerList, gameOrder) VALUES (?, '', '', '', ?, ?)");
        $stmtInsert->bind_param("sss", $code, $emptyJSON, $emptyJSON);
        if ($stmtInsert->execute()) {
            $gameCode = $code;
            break;
        }
    }

    $attempts++;
}

if ($gameCode) {
    // Final check: ensure it's in the database
    $stmtVerify = $conn->prepare("SELECT gameID FROM lobby WHERE gameID = ?");
    $stmtVerify->bind_param("s", $gameCode);
    $stmtVerify->execute();
    $result = $stmtVerify->get_result();

    if ($result->num_rows === 1) {
        echo json_encode(['success' => true, 'gameCode' => $gameCode]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to verify game code after insertion']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to generate a unique game code']);
}

$conn->close();
?>