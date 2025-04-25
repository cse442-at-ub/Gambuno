<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get the Authorization header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    echo json_encode(["success" => false, "message" => "Missing Authorization header"]);
    exit;
}

$token = trim(str_replace("Bearer", "", $headers['Authorization']));

// Check token against hashed tokens in DB
$sql = "SELECT username, auth FROM users";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    if (password_verify($token, $row['auth'])) {
        echo json_encode(["success" => true, "username" => $row['username']]);
        $conn->close();
        exit;
    }
}

echo json_encode(["success" => false, "message" => "Invalid token"]);
$conn->close();
?>