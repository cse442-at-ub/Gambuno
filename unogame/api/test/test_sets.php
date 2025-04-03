<?php

function testingFuntion1()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setPlaceCard($conn, '7', 'player_1284','blue_3');
}

function testingFuntion2()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setCardList($conn,'7', 'player_1284','["green_Draw2","yellow_5","wild_Draw4","blue_Skip","wild_Draw4","green_1"]');
}
function testingFuntion3()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setCurrentCard($conn, '1B1P8A','yellow_9');
}
function testingFuntion4()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setGameStatus($conn, '1B1P8A', 'waiting');
}
function testingFuntion5()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setMoney($conn, 'hellouser', 1500.00 );
}
function testingFuntion6()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }

    echo setCurrentPlayer($conn, '1B1P8A', 'Unoplayer10');
}


?>