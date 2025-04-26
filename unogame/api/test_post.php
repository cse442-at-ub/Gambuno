<?php
function testingFuntion1()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateSkipStatus($conn, "bardonia1", 1);
}

function testingFuntion2()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateGameOrder($conn, "JIQ9N9", ["u8u8u8u8","56"]);
}


function testingFuntion3()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateCurrentCard($conn, "SK482P", "blue_9");
}

function testingFuntion4()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateCurrentPlayer($conn, "SK482P", "SleepDeprived");
}



?>