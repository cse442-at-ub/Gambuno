<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

        if (!checkAuthDetails($username, $password)) {
            echo json_encode(["status" => "error", "message" => "Invalid username or password"]); 
            return; 
        }

        else{
            list($hashedPassword, $salt, $auth, $hashedAuth) = genAuth($password);
            setcookie("auth", $auth, time() + 8600, "/", true, true);
            $sql = "INSERT INTO users (username, hashed_password, salt, auth) VALUES ('$username', '$hashedPassword', '$salt', '$hashedAuth')";
                if ($conn->query($sql) === TRUE) {
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

    $conn->close();
}

insertUser($data, $conn);

?>