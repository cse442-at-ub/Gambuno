<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'auth.php';

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

function getCred($data) {
    return [$data['username'], $data['password']];
}

if (isset($data['username']) && isset($data['password'])) {
    list($username, $password) = getCred($data);
    registerHandler($username, $password);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>