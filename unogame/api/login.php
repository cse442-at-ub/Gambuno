<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json"); 

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

function verifyUser($conn, $data) {
    /*
    $sql = "SELECT * FROM users WHERE username = 'kurianvadakara'";
    $result = $conn->query($sql);
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['hashed_password'])) {
        return true;
    }
    return false;

    */
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $username = $data['username'];
    $password = $data['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    // Check if user exists
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user, $hashedPassword, $auth);
        if ($stmt->fetch() && password_verify($password, $hashedPassword)) {
            echo json_encode(["status" => "success", "message" => "User verified"]);
        }
        else {
            echo json_encode(["status" => "error", "message" => "User not found"]);
        }
    } 
    else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }

    // Close connections
    $stmt->close();
    $conn->close();
}

verifyUser($conn, $data);
?>