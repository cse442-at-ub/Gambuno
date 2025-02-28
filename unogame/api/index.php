<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'auth.php';

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

if (checkAuthDetails($username, $password)) {
    list($hashedPassword, $salt, $authToken, $hashedAuthToken) = genAuth($data['password']);
} else {
    echo json_encode(["status" => "error", "message" => "error in checkAuthDetails"]);
    return false;
}

setcookie("Authtoken", $authToken, time() + (86400 * 30), "/"); // 86400 = 1 day
insertUser($dbname, $username, $hashedPassword, $salt, $hashedAuthToken);

function insertUser($dbname, $username, $hashedPassword, $salt, $hashedAuthToken) {
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";

    // Connect to MySQL
    $conn = new mysqli($host, $user, $pass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO users (username, hashed_password, salt, auth) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $hashedPassword, $salt, $hashedAuthToken);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User created successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "User creation failed"]);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>