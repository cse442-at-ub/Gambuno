<?php

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


if (isset($_GET['action']) && $_GET['action'] == 'getAuth') {
    $auth = trim($_GET['auth']);
    $userVal = authCon($conn, $auth);
    echo $userVal;
    $conn->close();
    exit;
}

function authCon($conn, $iAuth) {
    $sql = "SELECT username, auth, money FROM users";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (password_verify($iAuth, $row['auth'])) {
                return json_encode([
                    "status" => true, 
                    "money" => $row['money'],
                    "username" =>$row['username']
                ]);
            }
        }
    }
    
    return json_encode([
        "status" => false, 
        "message" => "Invalid authentication"
    ]);
}
?>