<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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
    echo json_encode([
        "status"  => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

// Retrieve raw POST data if content type is JSON; otherwise, use $_POST
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $postData = json_decode(file_get_contents('php://input'), true);
} else {
    $postData = $_POST;
}

// Handle setGameStatus action
if (isset($postData['action']) && $postData['action'] === 'setGameStatus') {
    // Retrieve and sanitize parameters
    $gameID     = isset($postData['gameID']) ? trim($postData['gameID']) : '';
    $gameStatus = isset($postData['gameStatus']) ? trim($postData['gameStatus']) : '';

    // Validate required parameters
    if (empty($gameID) || empty($gameStatus)) {
        echo json_encode([
            "status"  => "error",
            "message" => "Required parameters (gameID, gameStatus) are missing."
        ]);
        $conn->close();
        exit;
    }

    // Validate gameStatus against allowed values
    $allowedStatuses = ["finished", "waiting", "inProgress"];
    if (!in_array($gameStatus, $allowedStatuses)) {
        echo json_encode([
            "status"  => "error",
            "message" => "Invalid gameStatus provided."
        ]);
        $conn->close();
        exit;
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE lobby SET gameStatus = ? WHERE gameID = ?");
    if (!$stmt) {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to prepare statement: " . $conn->error
        ]);
        $conn->close();
        exit;
    }

    // Bind parameters and execute the statement
    $stmt->bind_param("ss", $gameStatus, $gameID);
    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Game status updated successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to update game status: " . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Invalid action specified."
    ]);
}

$conn->close();
?>
