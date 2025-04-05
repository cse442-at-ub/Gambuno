<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection details
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['username']) || !isset($data['money'])) {
    die(json_encode([
        "status" => "error", 
        "message" => "Username and money are required"
    ]));
}

$username = $data['username'];
$money = $data['money'];

// Prepare SQL statement
$sql = "UPDATE users SET money = ? WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ds", $money, $username);

// Execute the statement
if ($stmt->execute()) {
    // Check if any rows were affected
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => "success", 
            "message" => "Money updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "No user found or money already at that value"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Error updating money: " . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>