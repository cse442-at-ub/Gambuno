<?php
// Allow cross-origin requests and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Database configuration
$host   = "localhost";
$user   = "kurianva";
$pass   = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Validate request
if (isset($_GET['action']) && $_GET['action'] === 'getPlayerList') {
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';

    // Ensure gameID is provided
    if (empty($gameID)) {
        echo json_encode(["status" => "error", "message" => "Missing gameID"]);
        exit();
    }

    // Prepare statement to get the playerList from the lobby table
    $stmt = $conn->prepare("SELECT playerList FROM lobby WHERE gameID = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Statement preparation failed: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("s", $gameID);
    $stmt->execute();

    // Fetch results
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        echo json_encode(["status" => "error", "message" => "Player list not found"]);
    } else {
        // Convert the stored playerList (assumed to be a JSON-encoded array) into a comma-separated string
        $players = json_decode($result["playerList"], true);
        if (is_array($players)) {
            $playerString = implode(",", $players);
        } else {
            // Fallback: if the data is not a valid JSON array, use the original stored value
            $playerString = $result["playerList"];
        }
        echo json_encode(["status" => "success", "playerList" => $playerString]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

// Close the connection
$conn->close();
?>
