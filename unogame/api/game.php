<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Validate required parameters first
if (isset($_GET['action']) && $_GET['action'] == 'intialize') {
    if (!isset($_GET['gameID'])) {
        echo json_encode(['error' => 'Missing gameID parameter']);
        exit;
    }
    
    $lobbyID = ($_GET['gameID']);
    
    try {
        require_once 'gameLogic.php';
        
        // Database connection
        $host = "localhost";
        $user = "kurianva";
        $pass = "50554678";
        $dbname = "cse442_2025_spring_team_c_db";
        
        $conn = new mysqli($host, $user, $pass, $dbname);
        
        if ($conn->connect_error) {
            echo json_encode(['error' => "Connection failed: " . $conn->connect_error]);
            exit;
        }
        
        // Create new GameLogic instance
        $game = new GameLogic($lobbyID);
        echo json_encode(["success" => true, "gameInfo" => $game->getGameInfo()]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'GameLogic error: ' . $e->getMessage()]);
    }
    
    exit;
} else {
    echo json_encode(['error' => 'Invalid or missing action parameter']);
}

if (isset($_GET['action']) && $_GET['action'] == 'call') {
    if (!isset($_GET['gameID'])) {
        echo json_encode(['error' => 'Missing gameID parameter']);
        exit;
    }
    $cardID = $_GET['cardID'];
    $playerID = ($_GET['playerID']);
    
    try {
        require_once 'gameLogic.php';
        
        // Database connection
        $host = "localhost";
        $user = "kurianva";
        $pass = "50554678";
        $dbname = "cse442_2025_spring_team_c_db";
        
        $conn = new mysqli($host, $user, $pass, $dbname);
        
        if ($conn->connect_error) {
            echo json_encode(['error' => "Connection failed: " . $conn->connect_error]);
            exit;
        }
        
        // Create new GameLogic instance
        $game = new GameLogic($lobbyID);
        
        echo json_encode([$game->handleCardPlacement($lobbyID, $cardID)]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'GameLogic error: ' . $e->getMessage()]);
    }
    
    exit;
} else {
    echo json_encode(['error' => 'Invalid or missing action parameter']);
}
?>