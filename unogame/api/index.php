<?php
//header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$allowed_origins = [
    'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/',
    'https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}


require_once 'auth.php';

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

function insertUser($data, $conn) {

    if (isset($data['username']) && isset($data['password'])) {
        $username = $data['username'];
        $password = $data['password'];
        $authToken = bin2hex(random_bytes(16)); // 80 bits of entropy
        $money = 1500;
        $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);
        if (!checkAuthDetails($username, $password)) {
            echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
            return;
        }

        else{
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            setcookie("auth", $authToken, time() + 3600, "/", "", true, true);

            $sql = "INSERT INTO users (username, hashed_password, auth, money, wins, total_games) VALUES (?, ?, ?, ?, 0, 0)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $username, $hashedPassword, $hashedAuthToken, $money);
            if ( $stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "User created successfully"]);
            }
            else {
                echo "User creation failed";
            }
        }
    }
    else {
        echo json_encode(["status" => "error", "message" => "check"]);
    }
    $stmt->close();
    $conn->close();
}

insertUser($data, $conn);

?>

