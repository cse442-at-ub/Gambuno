<?php
    // Allow cross-origin requests and set headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Content-Type: application/json");

    // Database configuration
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";
    $dbname = "cse442_2025_spring_team_c_db";

    // Create connection
    $conn = new mysqli($host, $user, $pass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
    }

    // Handle getPlayers action
    if (isset($_GET['action']) && $_GET['action'] === 'getPlayers') {
        $lobbyID = $_GET['lobbyID'];
        $stmt = $conn->prepare("SELECT playerName FROM players WHERE gameID = ?");
        $stmt->bind_param("s", $lobbyID);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["status" => "success", "players" => $result]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
    }

    $conn->close();
    ?>