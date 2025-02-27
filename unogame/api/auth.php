<?php

$excludeChars = [
    '"', "'", '*', '+', ',', '.', '/',
    ':', ';', '<', '>', '?', '[', '\\', ']',
    '`', '{', '|', '}', '~',
    ' ', "\n", "\t", "\r", "\f", "\v"
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



function registerHandler($username, $password) {
// Validate the password
if (validate_password($password)) {

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);


    $conn = new mysqli("localhost", "rancesco", "50485224", "cse442_2025_spring_team_c_db");
    

    // Check if the connection was successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed_password);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User created successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "User creation failed"]);
    }

    // Close the connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid password"]);
}
}


?>





