<?php

function testingFuntion()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo getPlayerName($conn, 'player_1284');
}

?>