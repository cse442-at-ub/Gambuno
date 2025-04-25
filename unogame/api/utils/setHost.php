<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database configuration
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Validate request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Parse incoming POST data (supports form-encoded & JSON)
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST; // Fallback to form data
    }

    if (isset($data['action']) && $data['action'] === 'setHost') {
        $gameID = isset($data['gameID']) ? trim($data['gameID']) : '';
        $playerID = isset($data['playerID']) ? trim($data['playerID']) : '';

        // Ensure required fields are provided
        if (empty($gameID) || empty($playerID)) {
            echo json_encode(["status" => "error", "message" => "Missing gameID or playerID"]);
            exit();
        }

        // Prepare update statement
        $stmt = $conn->prepare("UPDATE lobby SET host = ? WHERE gameID = ?");
        $stmt->bind_param("ss", $playerID, $gameID);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Host updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update host"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

// Close the connection
$conn->close();
?>
