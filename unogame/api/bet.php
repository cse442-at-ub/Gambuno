<?php
// Database configuration
$servername = "your_servername";
$dbusername = "your_dbusername";
$dbpassword = "your_dbpassword";
$dbname = "your_dbname";

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Handle leaderboard request
if (isset($_GET['action']) && $_GET['action'] == 'leaderboard') {
    $sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'money';
    $leaderboard = create_leaderboard($conn, $sort_by);
    echo json_encode(["status" => "success", "leaderboard" => $leaderboard]);
    $conn->close();
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

// Close connection if not already closed
if ($conn) {
    $conn->close();
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

    return $leaderboard;
}
?>