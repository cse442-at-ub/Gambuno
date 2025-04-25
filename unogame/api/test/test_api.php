<?php
include 'util.php';

$lobbyID = '12';
$username = 'u8u8u8u8';
$playerID = 'u8u8u8u8';
$newCardList = ["yellow_7","blue_3","yellow_3","wild_Draw4","wild_Draw4","blue_7","wild_Wild"];
$newCard = 'yellow_9';
$newGameStatus = 'inProgress';
$newMoney = 1000;

// Test getBettingAmount function
echo "getBettingAmount: ";
print_r(getBettingAmount($lobbyID));
echo "\n";

// Test getCurrentCard function
echo "getCurrentCard: ";
print_r(getCurrentCard($lobbyID));
echo "\n";

// Test getCurrentPlayer function
echo "getCurrentPlayer: ";
print_r(getCurrentPlayer($lobbyID));
echo "\n";

// Test getGame function
echo "getGame: ";
print_r(getGame($lobbyID));
echo "\n";

// Test getHost function
echo "getHost: ";
print_r(getHost($lobbyID));
echo "\n";

// Test getMoney function
echo "getMoney: ";
print_r(getMoney($username));
echo "\n";

// Test getPlayerCardList function
echo "getPlayerCardList: ";
print_r(getPlayerCardList($playerID));
echo "\n";

// Test getPlayerList function
echo "getPlayerList: ";
print_r(getPlayerList($playerID));
echo "\n";

// Test getPlayerName function
echo "getPlayerName: ";
print_r(getPlayerName($playerID));
echo "\n";

// Test getPlayers function
echo "getPlayers: ";
print_r(getPlayers($lobbyID));
echo "\n";

// Test setCardList function
echo "setCardList: ";
print_r(setCardList($lobbyID, $playerID, $newCardList));
echo "\n";

// Test setCurrentCard function
echo "setCurrentCard: ";
print_r(setCurrentCard($lobbyID, $newCard));
echo "\n";

// Test setGameStatus function
echo "setGameStatus: ";
print_r(setGameStatus($lobbyID, $newGameStatus));
echo "\n";

// Test setHost function
echo "setHost: ";
print_r(setHost($lobbyID, $playerID));
echo "\n";

// Test setMoney function
echo "setMoney: ";
print_r(setMoney($playerID, $newMoney));
echo "\n";

// Test updatePlayerWins function
echo "updatePlayerWins: ";
print_r(updatePlayerWins($playerID, $gameID));
echo "\n";
?>