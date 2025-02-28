<?php

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json"); 

require_once 'auth.php'; 

$host = "localhost"; 
$user = "kurianva"; 
$pass = "50554678"; 
$dbname = "cse442_2025_spring_team_c_db"; // Connect to MySQL 

$conn = new mysqli($host, $user, $pass, $dbname); 
$data = json_decode(file_get_contents("php://input"), true); 
// 

if (verifyUser($conn, $data["username"], $data["password"]) === true){ 
    echo json_decode(["status" => "success", "message" => "User verified"]); 
} 
else{ 
    echo json_decode(["status" => "error", "message" => "User not verified"]); 
} 
$conn->close();

?>