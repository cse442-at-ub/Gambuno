<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$data = json_decode(file_get_contents("php://input"), true);

function connect_db($username, $hash_password, $salt, $auth) {
    $conn = new mysqli($host, $user, $pass, $dbname);
    $stmt = "INSERT INTO users (username, hash_password, salt, auth) VALUES (?, ?, ?, ?)";

    if ($conn->query($stmt) === TRUE) {
        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to register user"]);
    }

    $conn->close();
}
