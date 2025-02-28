<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);
$username = 
$data = json_decode(file_get_contents("php://input"), true);
$hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

if (isset($data['username']) && isset($data['password'])) {
$username = $conn->real_escape_string($data['username']);
$password = $conn->real_escape_string($hashed_password);

$sql = "INSERT INTO users (username, hashed_password) VALUES ('$username', '$password')";

if ($conn->query($sql) === TRUE) {
echo json_encode(["status" => "success", "message" => "User created successfully"]);
} 
else {
echo "User creation failed";
}
} 

else {
echo json_encode(["status" => "error", "message" => "check"]);
}

$conn->close();