<?php
require_once util.php; // Ensure this path is correct
function testingFuntion()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    fun($conn, "sss",sss);
}


//curl -v "https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442c/api/util.php?action=testingFuntion"