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
if (isset($_GET['action']) && $_GET['action'] === 'getPlayerCardList') {
    $playerID = isset($_GET['playerID']) ? trim($_GET['playerID']) : '';
    $gameID = isset($_GET['gameID']) ? trim($_GET['gameID']) : '';
    // Ensure playerID is provided
    if (empty($playerID)) {
        echo json_encode(["status" => "error", "message" => "Missing playerID"]);
        exit();
    }

    // Prepare statement (assuming playerName corresponds to playerID)
    $stmt = $conn->prepare("SELECT cardList FROM players WHERE playerName = ? AND gameID = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Statement preparation failed: " . $conn->error]);
        exit();
    }
    
    $stmt->bind_param("ss", $playerID, $gameID);
    $stmt->execute();

    // Fetch results
    $result = $stmt->get_result()->fetch_assoc();

    if (!$result) {
        echo json_encode(["status" => "error", "message" => "Player not found"]);
    } else {
        // Convert the stored cardList (assumed to be a JSON array) into a comma-separated string
        $cards = json_decode($result["cardList"], true);
        if (is_array($cards)) {
            $cardString = implode(",", $cards);
        } else {
            // Fallback: if not a valid JSON array, use the stored value directly
            $cardString = $result["cardList"];
        }
        echo json_encode(["status" => "success", "cardList" => $cardString]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

// Close the connection
$conn->close();
?>
