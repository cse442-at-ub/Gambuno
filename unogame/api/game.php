<?php
function createDeck() {
    $colors = ['Red', 'Yellow', 'Green', 'Blue'];
    $values = array_merge(range(0, 9), ['Skip', 'Reverse', 'Draw Two']);
    $deck = [];

    foreach ($colors as $color) {
        foreach ($values as $value) {
            $deck[] = "$color" . "_" . "$value";
            if ($value !== 0) $deck[] = "$color" . "_" . "$value"; // Two of each except 0
        }
    }

    for ($i = 0; $i < 4; $i++) {
        $deck[] = 'Wild_Wild';
        $deck[] = 'Wild_DrawFour';
    }

    shuffle($deck);
    return $deck;
}

function setupGame($gameID, $conn) {
    // Fetch player list from DB
    $query = "SELECT playerList FROM lobby WHERE gameID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    $gameData = $result->fetch_assoc();
    
    if (!$gameData) {
        return "Game not found.";
    }
    
    $players = json_decode($gameData['playerList'], true);
    if (!$players || count($players) < 2) {
        return "Not enough players to start the game.";
    }
    
    $deck = createDeck();
    $hands = [];
    foreach ($players as $player) {
        $hands[$player] = array_splice($deck, 0, 7);
    }
    
    // Get a valid starting card (not Wild_DrawFour)
    do {
        $startingCard = array_pop($deck);
    } while (strpos($startingCard, 'Wild_DrawFour') !== false);
    
    $firstPlayer = $players[array_rand($players)];
    
    $updateQuery = "UPDATE lobby SET curCard = ?, curPlayer = ?, gameOrder = ?, gameStatus = 'active', betting_amt = NULL WHERE gameID = ?";
    $stmt = $conn->prepare($updateQuery);
    $gameOrder = json_encode($players);
    $stmt->bind_param("ssss", $startingCard, $firstPlayer, $gameOrder, $gameID);
    $stmt->execute();
    
    return [
        'players' => $hands,
        'startingCard' => $startingCard,
        'firstPlayer' => $firstPlayer
    ];
}

$gameID = '1'; // Replace with dynamic input
$conn = new mysqli("localhost", "kurianva", "50554678", "cse442_2025_spring_team_c_db");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$gameSetup = setupGame($gameID, $conn);
echo json_encode($gameSetup, JSON_PRETTY_PRINT);
$conn->close();

?>