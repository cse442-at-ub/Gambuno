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
$username =
$data = json_decode(file_get_contents("php://input"), true);


if (isset($data['username']) && isset($data['password'])) {

    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        echo json_encode(["status" => "error", "message" => "Invalid username"]);
        return;
    }
    if (!validatePassword($password)) {
        echo json_encode(["status" => "error", "message" => "User creation failed, Try again"]);
        return;
    } else {
        $salt = bin2hex(random_bytes(16));// gen salt
        $hashedPassword = password_hash($password . $salt, PASSWORD_BCRYPT);
        $authToken = "12345";//bin2hex(random_bytes(16));/// 80 bits of entropy
        $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);

        if ($conn->connect_error) {
            die("Opps something went wrong");
        }
        $dbEntry = $conn->prepare("INSERT INTO users (username, hashedPassword, salt, auth_token) VALUES (?, ?, ?, ?)");// prepare statement putting empty values
        $dbEntry->bind_param("ssss", $username, $hashedPassword, $salt, $hashedAuthToken);//  binds variables to for each ?

        if ($dbEntry->execute()) {
            setcookie("authToken", $authToken, time() + 86400, "/", "", true, true);// give user a cookie for authToken

            echo json_encode([
                "status" => "success",
                "message" => "User created successfully",
//                "auth_token" => $authToken  // Return the unhashed token to the client
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "User creation failed, Try again"]);
        }
        $dbEntry->close();
        $conn->close();
    }

    }else{
    echo json_encode(["status" => "error", "message" => "Invalid password or username"]);
}

$excludeChars = [
    '"', "'", '*', '+', ',', '.', '/', ':', ';', '<', '>', '?', '[', '\\', ']', '`', '{', '|', '}', '~', ' ', "\n", "\t", "\r", "\f", "\v"
];
$includeChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '='];


function validatePassword($password)
{
    global $excludeChars, $includeChars;

    // Check if password length is at least 8 characters
    if (strlen($password) < 8) {
        return false;
    }

    $containsUpper = false;
    $containsLower = false;
    $containsNumber = false;
    $containsSpecial = false;

    // Iterate through each character in the password
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

    // Return true only if all conditions are met
    return $containsLower && $containsNumber && $containsSpecial && $containsUpper;
}