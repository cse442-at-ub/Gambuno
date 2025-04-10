<?php
require_once './util2.php'

function connect(){
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
}

function testingFuntion1()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getMoney($conn, "mathew123");
}

function testingFuntion2()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setMoney($conn, "mathew123",10000.00);
}

function testingFuntion3()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getPlayerName($conn, "mathew123");
}

function testingFuntion4()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getCardList($conn, "YCFCF4","kurianvadakara");
}

function testingFuntion5()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setCardList($conn, "YCFCF4","kurianvadakara","red_1");
}

function testingFuntion6()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setCardList($conn, "YCFCF4","kurianvadakara","red_1");
}


function testingFuntion7()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getCurrentCard($conn, "XIHH0Q"); //blue_0
}

function testingFuntion8()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setCurrentCard($conn, "XIHH0Q","blue_1"); 
}


function testingFuntion9()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getCurrentPlayer($conn, "JIQ9N9"); 
}

function testingFuntion10()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setCurrentPlayer($conn, "JIQ9N9","u8u8u8u8"); 
}


function testingFuntion11()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getPlayerList($conn, "2WJRZW"); 
}


function testingFuntion12()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    getBettingAmount($conn, "WJCKSW"); //3.00
}

function testingFuntion13()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setPlacedCard($conn, "YCFCF4","bardonia1","red_1"); //3.00
}

function testingFuntion14()
{
    $conn = getDatabaseConnection();
    if (!$conn) {
        return "Failed to connect to the database.";
    }
    setGameStatus($conn, "1B1P8A","inProgress"); //3.00
}

?>