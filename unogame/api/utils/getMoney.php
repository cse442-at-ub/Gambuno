<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Database configuration (Consider using environment variables for production)
$host   = "localhost";
$user   = "kurianva";
$pass   = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Handle getMoney action
if (isset($_GET['action']) && $_GET['action'] === 'getMoney') {
    // Retrieve and sanitize the username parameter
    $username = isset($_GET['username']) ? trim($_GET['username']) : '';

    // Check if the username parameter is provided
    if (empty($username)) {
        echo json_encode(["status" => "error", "message" => "Username not provided"]);
        $conn->close();
        exit;
    }

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT money FROM users WHERE username = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement"]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Process the returned value
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["money" => $row['money']]);
    } else {
        // If no record is found, you can either return a default value or an error message
        echo json_encode(["money" => 0, "message" => "No record found for the provided username"]);
    }
    
    $stmt->close();
}
$conn->close();
?>
