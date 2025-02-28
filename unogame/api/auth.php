<?php
$excludeChars = [
    '"', "'", '*', '+', ',', '.', '/', ':', ';', '<', '>', '?', '[', '\\', ']', '`', '{', '|', '}', '~', ' ', "\n", "\t", "\r", "\f", "\v"
];
$includeChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '='];

function validatePassword($password)
{
    global $excludeChars, $includeChars;

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
    $salt = bin2hex(random_bytes(16));
    $hashedPassword = password_hash($password + $salt, PASSWORD_BCRYPT);
    $authToken = "1234";//bin2hex(random_bytes(16)); // 80 bits of entropy
    $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);
    return [$hashedPassword, $salt, $authToken, $hashedAuthToken];
}
