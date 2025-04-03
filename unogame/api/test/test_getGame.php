
<?php

function testingFuntion()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo getGame($conn, '1B1P8A');
}

?>