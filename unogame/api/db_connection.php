<?php
// Replace these values with your actual database credentials
$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Create connection
$conn = mysqli_connect($host, $user, $pass, $dbname);

// Check connection
if (!$conn) {
    $db_error = mysqli_connect_error(); // Store error without outputting
    // Let calling scripts handle the error
}
?>
