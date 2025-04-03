<?php
// Database configuration

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header('Content-Type: application/json');

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

if (php_sapi_name() == 'cli') {
    $_SERVER['REQUEST_METHOD'] = 'GET';
    // Check if there's a command-line argument
    if (isset($argv[1])) {
        parse_str($argv[1], $_GET);
    } else {
        // Still check stdin as fallback
        parse_str(file_get_contents('php://stdin'), $_GET);
    }
}
// Handle leaderboard request
if (isset($_GET['action']) && $_GET['action'] == 'leaderboard') {
    $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'money';
    $leaderboard = create_leaderboard($conn, $sort_by);
    echo json_encode(["status" => "success", "leaderboard" => $leaderboard]);
    $conn->close();
    exit;
}

if (isset($_GET['action']) && $_GET['action'] == 'getBet') {
    $gameId = $_GET['gameID'];
    $bet = getBet($conn, $gameId);
    echo $bet;
    exit;
}

// Handle money request (your existing code)
$username = isset($_GET['username']) ? $_GET['username'] : '';
if (!empty($username)) {
    $stmt = $conn->prepare("SELECT money FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    // Fetch the money value
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "money" => $row['money']]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

    // Close statement
    $stmt->close();
}


/**
 * Creates a leaderboard sorted by the specified column
 * @param mysqli $conn Database connection
 * @param string $sort_by Column to sort by (default: 'money')
 * @return array Sorted leaderboard data
 */
function create_leaderboard($conn, $sort_by = 'money') {
    // Validate sort_by parameter to prevent SQL injection
    $valid_sort_columns = ['money', 'username', 'wins', 'losses']; // add other valid columns as needed
    $sort_column = in_array($sort_by, $valid_sort_columns) ? $sort_by : 'money';

    // Using string interpolation for column names is safe here because we validated them
    $query = "SELECT username, money FROM users ORDER BY $sort_column DESC";
    $result = $conn->query($query);

    $leaderboard = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $leaderboard[] = $row;
        }
    }

    return ($leaderboard);
}

function getPlayerName($conn, $username) {
    // Since playerID appears to be the username directly based on your DB structure
    $query = "SELECT money FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $money= $row['money'];
        return $money;
    }
}

function getBet($conn, $gameID){
    $query = "SELECT betting_amt FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $gameID); 
    $stmt->execute();

    // Bind result variable
    $stmt->bind_result($betting_amt);

    // Fetch the result
    if ($stmt->fetch()) {
        return json_encode(["success" => true, "bet" => $betting_amt]);
    } else {
        return json_encode(["success" => false, "message" => "error"]);
    }   
}

create_leaderboard($conn);

?>