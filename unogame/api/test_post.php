<?php
function testingFuntion1()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateSkipStatus($conn, "bardonia1", 1)
}

function testingFuntion2()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateGameOrder($conn, "12", ["hellouser123","wecooked","u8u8u8u8","kurianvadakara","Unoplayer3"])
}


function testingFuntion3()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateCurrentCard($conn, "SK482P", "blue_4")
}

function testingFuntion4()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateCurrentPlayer($conn, "SK482P", "SleepDeprived")
}

function testingFuntion5()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    updateCardEffect($conn, "SK482P", "Skip")
}

?>