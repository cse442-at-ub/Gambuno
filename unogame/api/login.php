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

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

// Validate input
if (!$username || !$password) {
    die(json_encode(["status" => "error", "message" => "Username and password required"]));
}

// Prepare and execute the SQL statement
$sql = "SELECT username, hashed_password FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

// Bind the results
$stmt->bind_result($user, $hashedPassword);

if ($stmt->num_rows > 0) {
    $stmt->fetch(); // Fetch the result
    if (password_verify($password, $hashedPassword)) {
        // Generate a token (example using sha256 and uniqid)
        $token = bin2hex(random_bytes(16));
        $hashToken = password_hash($token, PASSWORD_BCRYPT);
        // Set the token as a secure HttpOnly cookie
        setcookie("auth", $token, time() + 3600, "/", "", false, true);

        $query = "UPDATE users SET auth = ? WHERE username = ?";
        $st = $conn->prepare($query);
        $st->bind_param("ss", $hashToken, $username);
        $st->execute();

        echo json_encode(["status" => "success", "message" => "User verified", "token" => $token]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username"]);
}

// Close connections
$stmt->close();
$conn->close();
?>