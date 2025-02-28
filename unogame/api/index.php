<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

if (checkAuthDetails($data)) {
    $username = $data['username'];
    list($hashedPassword, $salt, $hashedAuthToken) = genAuth($data['password']);
}else{
    echo json_encode(["status" => "error", "message" => "error in checkAuthDetails"]);
    return false;
}



//write your DB helpers here


//$stmt = $conn->prepare("INSERT INTO users (username, password, salt, auth_token) VALUES (?, ?, ?, ?)");
//$stmt->bind_param("ssss", $username, $hashedPassword, $salt, $hashedAuthToken);
//
//if ($stmt->execute()) {
//    echo json_encode(["status" => "success", "message" => "User created successfully"]);
//} else {
//    echo json_encode(["status" => "error", "message" => "User creation failed"]);
//}
//
//$stmt->close();
//$conn->close();
?>