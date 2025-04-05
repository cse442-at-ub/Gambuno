<?php
require_once 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');


function getDatabaseConnection()
{
    $host = "localhost";
    $user = "kurianva";
    $pass = "50554678";
    $dbname = "cse442_2025_spring_team_c_db";

    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

//add the code for game logic here

//here a breakdown of each field in the lobby table:
//gameID: unique identifier for the game lobby, is a string
//curCard: the current card in play which players must match, card match the following format "color_#", where color is red, blue, green, yellow and # is a number 0-9 or a special card like "wild_0" that wildcards
//curPlayer: the playerID of the player whose turn it is to play
//playerList: list of all players in the lobby shown through their PlayerIDs
//gameOrder: the order in which players take their turns, shown through their PlayerIDs
//betting_amt: the amount of money each player bets to join the game, which is an integer
//gameStatus: the status of the game, e.g., 'waiting', 'inProgress', 'finished'
//cardEffect: the effect of the card played, such as "skip", "reverse", "draw2", "wild", etc. This will be used to determine the next action in the game it will be used it later versions

//here a breakdown of each field in the player table:
//gameID: the unique identifier for the game lobby that the player is in
//playerID: unique identifier for the player an auth token given to them at login in as a cookie
//playerName: the userName of the player which will be displayed in the game lobby and to other users
// placedCard: the card that the player has placed in the current round, in the same format as curCard and need to be verified
//skipped: a boolean value indicating whether the player has been skipped in the current round (1 for true, 0 for false). will not be used not but will be useful for future game logic
//wins: the number of games the player has won, an integer
//totalGames: the total number of games the player has played, an integer

//here a breakdown of each field in the users table:
//username: the unique username of the player which will be displayed in the game lobby and to other users
//hashPassword: the hashed password of the player
//authTokenHash: the hashed authentication token for the player, used for session management and will be used as the PlayerID in the player table
//money: the amount of money the player has, an integer. This is used to determine if the player can afford to join a game or not



// You can assume that the game starts with at least 3 players in the lobby, and each player has a unique playerID, has been given random cards, and all the field in the lobby have be have been set to some random initial values.
//player stuff
////you may use code from util.php which serves as a libary of utility functions. here a breakdown of each of them
/// getMoney/setMoney: which will set or get the money of a player in the users table on the database
/// getCardList/setCardList: which will get the cardList to be displayed to the user or set the cardList which will be used when a player draws/places a card, it will be in the player table on the DB
/// getPlayerName: which will get the player name of a player in the users table on the players Table in the database
/// getPlacedCard/setPlaceCard: which will get or set the placed card of a player in the player table on the database that was retrieved from front end
///
/// Lobby stuff
/// getGameOrder/setGameOrder: which will get or set the game order of the players in the lobby table on the database, will be reversed if a reverse card is played in later versions
/// getCurrentCard/setCurrentCard: which will get or set the current card which players have to match to play,
//// functions: getMoney/setMoney, getPlayerName, getCardList/setCardList, getPlacedCard,
/// getCurrentPlayer/setCurrentPlayer: which will get or set the current player whose turn it is to play in the lobby table on the database, only the current player can play a card
/// getCardEffect/setCardEffect: which will get or set the card effect of the current card played in the lobby table on the database, this will be used to determine the next action in the game will be used in later versions
//// getGameOrder/setGameOrder: which will get the currect order of the game players in the lobby table on the database and update it when a player plays a valid card
/// getPlayerList: which will get the list of all players in the lobby from the lobby table on the database, it will be used it display are the players in the lobby
////setGameStatus/getGameStatus: which will set or get the game status of the lobby in the lobby table on the database, it will be used to determine if the game is in progress or finished
///
/// make sure all database queries are prepared statements to prevent SQL injection, and always sanitize user input.
/// add error handling to all database operations to ensure that any issues are logged for testing and debugging purposes.
///







