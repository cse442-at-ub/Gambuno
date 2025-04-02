<?php
function getDatabaseConnection()
{
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";
    $dbname = "cse442_2025_spring_team_c_db";

    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Test the database connection
$conn = getDatabaseConnection();
if ($conn) {
    echo "Connected to database successfully.\n";

    // Optionally perform a simple query to verify
    $result = $conn->query("SELECT NOW() as currentTime");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "Current Time from DB: " . $row['currentTime'] . "\n";
    } else {
        echo "Query failed: " . $conn->error . "\n";
    }

    $conn->close();
}
?>
