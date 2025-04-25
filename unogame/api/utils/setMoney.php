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

// Handle setMoney action
if (isset($postData['action']) && $postData['action'] === 'setMoney') {
    // Retrieve and sanitize the newMoney and playerID parameters
    $newMoney = isset($postData['newMoney']) ? trim($postData['newMoney']) : null;
    $playerID = isset($postData['playerID']) ? trim($postData['playerID']) : null;

    // Validate required parameters
    if ($newMoney === null || $playerID === null) {
        echo json_encode([
            "status"  => "error",
            "message" => "Required parameters (newMoney, playerID) are missing."
        ]);
        $conn->close();
        exit;
    }

    // Validate that newMoney is numeric
    if (!is_numeric($newMoney)) {
        echo json_encode([
            "status"  => "error",
            "message" => "Invalid value for newMoney."
        ]);
        $conn->close();
        exit;
    }

    // Convert newMoney to a numeric value
    $newMoney = (float)$newMoney;

    // Prepare the SQL statement to update money for the given playerID
    $stmt = $conn->prepare("UPDATE users SET money = ? WHERE username = ?");
    if (!$stmt) {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to prepare statement: " . $conn->error
        ]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("ds", $newMoney, $playerID);

    // Execute the statement and return an appropriate JSON response
    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Money updated successfully."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to update money: " . $stmt->error
        ]);
    }

    $stmt->close();
}

$conn->close();
?>
