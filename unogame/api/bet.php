<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}
$username = isset($_GET['username']) ? $_GET['username'] : '';
$stmt = $conn->prepare("SELECT money FROM users WHERE username = ?");
$stmt->bind_param("s", $username);

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Fetch the money value
if ($row = $result->fetch_assoc()) {
    echo json_encode(["status" => "success", "money" => $row['money']]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);;

}

// Close statement and connection
$stmt->close();
$conn->close();
?>