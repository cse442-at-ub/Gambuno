<?php

function testingFuntion()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo getPlayerList($conn, '2LWOTB');
}

?>