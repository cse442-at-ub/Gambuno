<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

function validatePassword($password)
{
    $excludeChars = [
        '"', "'", '*', '+', ',', '.', '/', ':', ';', '<', '>', '?', '[', '\\', ']', '`', '{', '|', '}', '~', ' ', "\n", "\t", "\r", "\f", "\v"
    ];
    $includeChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '='];

    if (strlen($password) < 8) {
        return false;
    }

    $containsUpper = false;
    $containsLower = false;
    $containsNumber = false;
    $containsSpecial = false;

    for ($i = 0; $i < strlen($password); $i++) {
        $char = $password[$i];

        if (in_array($char, $excludeChars)) {
            return false;
        }
        if (ctype_upper($char)) {
            $containsUpper = true;
        }
        if (ctype_lower($char)) {
            $containsLower = true;
        }
        if (ctype_digit($char)) {
            $containsNumber = true;
        }
        if (in_array($char, $includeChars)) {
            $containsSpecial = true;
        }
    }
    return $containsLower && $containsNumber && $containsSpecial && $containsUpper;
}

function checkAuthDetails($username, $password){
    if (!isset($username) || !isset($password)) {
        echo json_encode(["status" => "error", "message" => "Username and password are required"]);
        return false;
    }
    if (!validatePassword($password)) {
        echo json_encode(["status" => "error", "message" => "Invalid password"]);
        return false;
    }
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        echo json_encode(["status" => "error", "message" => "Invalid username"]);
        return false;
    }
    return true;
}

function genAuth($password){
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $authToken = bin2hex(random_bytes(16));
    $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);
    return [$hashedPassword, $authToken, $hashedAuthToken];
}

function verifyUser($conn, $username, $password) {
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id, username, hashed_password FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $hashedPassword);
        if ($stmt->fetch() && password_verify($password, $hashedPassword)) {
            echo json_encode(["status" => "success", "message" => "User verified", "token" => $authToken]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }

    $stmt->close();
    $conn->close();
}