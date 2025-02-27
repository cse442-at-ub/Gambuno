<?php

$excludeChars = [
    '"', "'", '*', '+', ',', '.', '/',
    ':', ';', '<', '>', '?', '[', '\\', ']',
    '`', '{', '|', '}', '~',
    ' ', "\n", "\t", "\r", "\f", "\v"
];

$includeChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '='];

function validate_password($password)
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

?>