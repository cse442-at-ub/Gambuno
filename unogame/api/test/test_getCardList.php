<?php

function testingFuntion()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo getCardList($conn, '7','test_player_3');
}

?>