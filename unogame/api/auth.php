<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

        // Check if the character is in the exclude list
        if (in_array($char, $excludeChars)) {
            return false;
        }

        // Check for uppercase letters
        if (ctype_upper($char)) {
            $containsUpper = true;
        }

        // Check for lowercase letters
        if (ctype_lower($char)) {
            $containsLower = true;
        }

        // Check for numbers
        if (ctype_digit($char)) {
            $containsNumber = true;
        }

        // Check for special characters
        if (in_array($char, $includeChars)) {
            $containsSpecial = true;
        }
    }
    return $containsLower && $containsNumber && $containsSpecial && $containsUpper;
}


function checkAuthDetails($username, $password){
    if (!isset($username) || !isset($password)) {// null check
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
    return True;
}

function genAuth($password){
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $authToken = bin2hex(random_bytes(16)); // 80 bits of entropy
    $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);
    return [$hashedPassword, $authToken, $hashedAuthToken];
}


function verifyUser($conn, $username, $password) {
    /*
    $sql = "SELECT * FROM users WHERE username = 'kurianvadakara'";
    $result = $conn->query($sql);
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['hashed_password'])) {
        return true;
    }
    return false;

    */
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    // Check if user exists
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $hashedPassword, $auth);
        if ($stmt->fetch() && password_verify($password, $hashedPassword)) {
            echo json_encode(["status" => "success", "message" => "User verified"]);
        }
        else {
            echo json_encode(["status" => "error", "message" => "User not found"]);
        }
    } 
    else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }

    // Close connections
    $stmt->close();
    $conn->close();
}




