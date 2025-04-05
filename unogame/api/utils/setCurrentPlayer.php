<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST"); // Updated to POST
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

// Retrieve raw POST data if content type is JSON
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $postData = json_decode(file_get_contents('php://input'), true);
} else {
    $postData = $_POST;
}

// Handle setCurrentCard action
if (isset($postData['action']) && $postData['action'] === 'setCurrentPlayer') {
    // Retrieve and sanitize parameters
    $gameID       = isset($postData['gameID']) ? trim($postData['gameID']) : '';
    $newCurPlayer = isset($postData['newCurPlayer']) ? trim($postData['newCurPlayer']) : '';
    
    // Check if both parameters are provided
    if (empty($gameID) || empty($newCurPlayer)) {
        echo json_encode([
            "status" => "error",
            "message" => "Required parameters (gameID, newCurPlayer) not provided"
        ]);
        $conn->close();
        exit;
    }
    
    // Prepare the SQL statement to update the current player
    $stmt = $conn->prepare("UPDATE lobby SET curPlayer = ? WHERE gameID = ?");
    if (!$stmt) {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to prepare statement: " . $conn->error
        ]);
        $conn->close();
        exit;
    }
    
    // Bind parameters in the order matching the SQL query
    $stmt->bind_param("ss", $newCurPlayer, $gameID);
    
    // Execute the statement and return a descriptive response
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Current player updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update current player: " . $stmt->error
        ]);
    }
    
    $stmt->close();
}


$conn->close();
?>
