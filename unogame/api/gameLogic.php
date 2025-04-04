<?php
require_once 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

/**
 * GameLogic Class
 *
 * Implements core game mechanics for a multiplayer UNO game
 * Handles game state management, turn progression, card effects, and win conditions
 * Updated to align with the actual database schema
 */

function getDatabaseConnection(){
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

class GameLogic {
    // Private properties for game state
    private $conn;
    private $lobbyID;
    private $currentCard;
    private $currentPlayer;
    private $gameOrder; // 1 for normal, -1 for reversed
    private $gameStatus; // 'waiting', 'active', 'ended'
    private $players = [];
    private $activeEffects = [];

    // Constants for card types
    const CARD_SKIP = 'Skip';
    const CARD_REVERSE = 'Reverse';
    const CARD_DRAW_TWO = 'Draw2';
    const CARD_WILD = 'Wild';
    const CARD_WILD_DRAW_FOUR = 'Wild_Draw4';

    /**
     * Constructor
     *
     * @param int $lobbyID The ID of the game lobby
     */
    public function __construct($lobbyID) {
        $this->conn = getDatabaseConnection();
        $this->lobbyID = $lobbyID;
        $this->initializeGameState();
    }

    /**
     * Initialize game state from database
     */

    private function initializeGameState() {
        // Get lobby information
        $stmt = $this->conn->prepare("SELECT * FROM lobby WHERE gameID = ?");
        $stmt->bind_param("s", $this->lobbyID);
        $stmt->execute();
        $lobbyData = $stmt->get_result()->fetch_assoc();

        if (!$lobbyData) {
            throw new Exception("Lobby not found");
        }

        $this->currentCard = $lobbyData['curCard'];
        $this->currentPlayer = $lobbyData['curPlayer'];
        $this->gameOrder = $lobbyData['gameOrder'] ? $lobbyData['gameOrder'] : 1;
        $this->gameStatus = $lobbyData['gameStatus'] ? $lobbyData['gameStatus'] : 'waiting';

        // Get players in lobby
        $stmt = $this->conn->prepare("SELECT * FROM players WHERE gameID = ?");
        $stmt->bind_param("s", $this->lobbyID);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($player = $result->fetch_assoc()) {
            $this->players[] = $player;

            // Load active effects
            if (!empty($player['cardEffect'])) {
                $this->activeEffects[$player['playerID']] = $player['cardEffect'];
            }
        }
    }

    /**
     * Fetch the current game state
     *
     * @param int $requestingPlayerID ID of player requesting the state
     * @return array Game state data
     */
    public function fetchGameState($lobbyID, $playerID) {
        // Check if debugging is enabled via query parameter: ?debug=1
        $debug = isset($_GET['debug']) && $_GET['debug'] == 1;

        // Get database connection
        $conn = getDatabaseConnection();
        if (!$conn) {
            if ($debug) {
                header('Content-Type: text/plain');
                echo "Database connection failed\n";
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Database connection failed']);
                exit;
            }
        }

        if ($debug) echo "Connected to database\n";

        // Get lobby information
        $stmt = $conn->prepare("SELECT CurrentCard, CurrentPlayer, GameOrder, GameStatus FROM Lobby WHERE lobbyID = ?");
        if (!$stmt) {
            if ($debug) {
                header('Content-Type: text/plain');
                echo "SQL prepare failed: " . $conn->error . "\n";
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Database error']);
                exit;
            }
        }

        if ($debug) echo "SQL statement prepared successfully\n";

        $stmt->bind_param("s", $lobbyID);
        $stmt->execute();
        $result = $stmt->get_result();
        $lobbyData = $result ? $result->fetch_assoc() : null;

        if (!$lobbyData) {
            if ($debug) {
                header('Content-Type: text/plain');
                echo "Lobby data not found for lobbyID: " . $lobbyID . "\n";
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Lobby not found']);
                exit;
            }
        }

        if ($debug) echo "Lobby Data: " . json_encode($lobbyData) . "\n";

        // Get all players in this lobby
        $players = getPlayers($conn, $lobbyID);
        if (!$players) {
            if ($debug) echo "No players found for lobbyID: " . $lobbyID . "\n";
        } else {
            if ($debug) echo "Players fetched: " . json_encode($players) . "\n";
        }

        // Get active effects (assuming stored in Player table as CardEffect)
        $activeEffects = [];
        foreach ($players as $player) {
            if (!empty($player['CardEffect'])) {
                $activeEffects[$player['playerID']] = json_decode($player['CardEffect'], true);
            }
        }

        if ($debug) echo "Active Effects: " . json_encode($activeEffects) . "\n";

        // Build the game state array
        $gameState = [
            'success' => true,
            'currentCard' => $lobbyData['CurrentCard'],
            'currentPlayer' => $lobbyData['CurrentPlayer'],
            'activeEffects' => $activeEffects,
            'gameOrder' => json_decode($lobbyData['GameOrder'], true),
            'gameStatus' => $lobbyData['GameStatus'],
            'players' => []
        ];

        if ($debug) echo "Initial Game State: " . json_encode($gameState) . "\n";

        foreach ($players as $player) {
            // Decode the player's card list
            $playerCards = json_decode($player['CardList'], true);
            if ($debug && !$playerCards) {
                echo "Failed to decode CardList for playerID: " . $player['playerID'] . "\n";
            }

            // Print player data if in debug mode
            if ($debug) echo "Processing player: " . json_encode($player) . "\n";

            $playerData = [
                'playerID' => $player['playerID'],
                'username' => $player['playerName'],
                'cardCount' => is_array($playerCards) ? count($playerCards) : 0,
                'isSkipped' => (bool)$player['Skip']
            ];

            // Only include full hand for the requesting player
            if ($player['playerID'] == $playerID) {
                $playerData['hand'] = $playerCards;
                if ($debug) echo "Adding full hand for playerID: " . $playerID . "\n";
            }

            $gameState['players'][] = $playerData;
        }

        // Close the connection
        $conn->close();

        if ($debug) {
            header('Content-Type: text/plain');
            echo "Final Game State: " . json_encode($gameState) . "\n";
            exit;
        } else {
            // Set header and return JSON response
            header('Content-Type: application/json');
            echo json_encode($gameState);
            exit;
        }
    }


    /**
     * Handle a card played by a player
     *
     * @param int $playerID The ID of the player playing the card
     * @param string $card The card being played
     * @param string|null $chosenColor Color chosen for wild cards
     * @return array Result of the action
     */
    public function handleCardPlacement($playerID, $card, $chosenColor = null) {
        // Verify it's the player's turn
        if ($playerID != $this->currentPlayer) {
            return ['success' => false, 'message' => 'Not your turn'];
        }

        // Get player's hand from database
        $stmt = $this->conn->prepare("SELECT cardList FROM players WHERE playerID = ?");
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        $playerData = $result->fetch_assoc();

        if (!$playerData) {
            return ['success' => false, 'message' => 'Player not found'];
        }

        $playerCards = json_decode($playerData['cardList'], true);

        // Check if player has the card
        if (!in_array($card, $playerCards)) {
            return ['success' => false, 'message' => 'Card not in hand'];
        }

        // Validate the card play
        if (!$this->validateCardPlay($card)) {
            return ['success' => false, 'message' => 'Invalid card play'];
        }

        // Parse the card
        $cardComponents = $this->parseCard($card);
        $cardColor = $cardComponents['color'];
        $cardValue = $cardComponents['value'];

        // Handle wild cards
        if ($cardColor === 'wild') {
            if (!$chosenColor || !in_array($chosenColor, ['red', 'blue', 'green', 'yellow'])) {
                return ['success' => false, 'message' => 'Must choose a valid color for wild card'];
            }
            $card = $card . '_' . $chosenColor;
        }

        // Remove card from player's hand
        $playerCards = array_diff($playerCards, [$card]);

        // Update database
        $cardListJson = json_encode(array_values($playerCards));
        $stmt = $this->conn->prepare("UPDATE players SET cardList = ?, placedCard = ? WHERE playerID = ?");
        $stmt->bind_param("sss", $cardListJson, $card, $playerID);
        $stmt->execute();

        // Update current card in lobby
        $stmt = $this->conn->prepare("UPDATE lobby SET curCard = ? WHERE gameID = ?");
        $stmt->bind_param("ss", $card, $this->lobbyID);
        $stmt->execute();

        // Set current card
        $this->currentCard = $card;

        // Check win condition
        if (count($playerCards) === 0) {
            $this->gameStatus = 'ended';
            $this->updateGameStatistics($playerID);
            return [
                'success' => true,
                'message' => 'Player won',
                'gameOver' => true,
                'winner' => $playerID
            ];
        }

        // Handle card effect
        $effectResult = $this->handleCardEffect($cardValue, $chosenColor);

        // Move to next player
        $this->moveToNextPlayer();

        return [
            'success' => true,
            'message' => 'Card played successfully',
            'effectApplied' => $effectResult['effectApplied'],
            'effectDetails' => $effectResult['details']
        ];
    }

    /**
     * Handle effects of special cards
     *
     * @param string $cardValue Value component of the card
     * @param string|null $chosenColor Color chosen for wild cards
     * @return array Result of effect application
     */
    private function handleCardEffect($cardValue, $chosenColor = null) {
        $result = [
            'effectApplied' => false,
            'details' => []
        ];

        switch ($cardValue) {
            case self::CARD_SKIP:
                $nextPlayer = $this->getNextPlayerId();
                $this->setPlayerSkipped($nextPlayer);
                $result['effectApplied'] = true;
                $result['details'] = ['type' => 'skip', 'affectedPlayer' => $nextPlayer];
                break;

            case self::CARD_REVERSE:
                $this->reverseGameOrder();
                $result['effectApplied'] = true;
                $result['details'] = ['type' => 'reverse', 'newOrder' => $this->gameOrder];
                break;

            case self::CARD_DRAW_TWO:
                $nextPlayer = $this->getNextPlayerId();
                $this->addCardsToPlayer($nextPlayer, 2);
                $result['effectApplied'] = true;
                $result['details'] = ['type' => 'draw2', 'affectedPlayer' => $nextPlayer];
                break;

            case self::CARD_WILD:
                $result['effectApplied'] = true;
                $result['details'] = ['type' => 'wild', 'chosenColor' => $chosenColor];
                break;

            case self::CARD_WILD_DRAW_FOUR:
                $nextPlayer = $this->getNextPlayerId();
                $this->addCardsToPlayer($nextPlayer, 4);
                $result['effectApplied'] = true;
                $result['details'] = [
                    'type' => 'wild_draw4',
                    'affectedPlayer' => $nextPlayer,
                    'chosenColor' => $chosenColor
                ];
                break;
        }

        return $result;
    }

    /**
     * Set a player to be skipped in the next turn cycle
     *
     * @param int $playerID The ID of the player to skip
     */
    private function setPlayerSkipped($playerID) {
        $stmt = $this->conn->prepare("UPDATE players SET skipped = 1 WHERE playerID = ?");
        $stmt->bind_param("s", $playerID);
        $stmt->execute();

        // Update local state
        foreach ($this->players as &$player) {
            if ($player['playerID'] == $playerID) {
                $player['skipped'] = 1;
                break;
            }
        }
    }

    /**
     * Reverse the game order
     */
    private function reverseGameOrder() {
        $this->gameOrder *= -1;
        $stmt = $this->conn->prepare("UPDATE lobby SET gameOrder = ? WHERE gameID = ?");
        $stmt->bind_param("ss", $this->gameOrder, $this->lobbyID);
        $stmt->execute();
    }

    /**
     * Add cards to a player's hand
     *
     * @param int $playerID The ID of the player
     * @param int $count Number of cards to add
     */
    private function addCardsToPlayer($playerID, $count) {
        // Get current cards
        $stmt = $this->conn->prepare("SELECT cardList FROM players WHERE playerID = ?");
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        $playerData = $result->fetch_assoc();

        if (!$playerData) {
            return;
        }

        $playerCards = json_decode($playerData['cardList'], true);

        for ($i = 0; $i < $count; $i++) {
            $playerCards[] = $this->drawRandomCard();
        }

        $cardListJson = json_encode($playerCards);
        $stmt = $this->conn->prepare("UPDATE players SET cardList = ? WHERE playerID = ?");
        $stmt->bind_param("ss", $cardListJson, $playerID);
        $stmt->execute();
    }

    /**
     * Move to the next player in turn order
     */
    public function moveToNextPlayer() {
        $currentPlayerIndex = $this->getPlayerIndexById($this->currentPlayer);
        $nextPlayerIndex = null;
        $playerCount = count($this->players);
        $direction = $this->gameOrder;

        // Find the next non-skipped player
        $i = 1;
        while ($i <= $playerCount) {
            $nextIndex = ($currentPlayerIndex + ($i * $direction) + $playerCount) % $playerCount;
            $nextPlayer = $this->players[$nextIndex];

            // If player is set to be skipped, clear their skip status and continue
            if ($nextPlayer['skipped'] == 1) {
                $stmt = $this->conn->prepare("UPDATE players SET skipped = 0 WHERE playerID = ?");
                $stmt->bind_param("s", $nextPlayer['playerID']);
                $stmt->execute();

                $this->players[$nextIndex]['skipped'] = 0;
                $i++;
                continue;
            }

            $nextPlayerIndex = $nextIndex;
            break;
        }

        if ($nextPlayerIndex !== null) {
            $this->currentPlayer = $this->players[$nextPlayerIndex]['playerID'];
            $stmt = $this->conn->prepare("UPDATE lobby SET curPlayer = ? WHERE gameID = ?");
            $stmt->bind_param("ss", $this->currentPlayer, $this->lobbyID);
            $stmt->execute();
        }
    }

    /**
     * Get the index of a player in the players array by ID
     *
     * @param int $playerID The ID of the player
     * @return int Index of the player
     */
    private function getPlayerIndexById($playerID) {
        foreach ($this->players as $index => $player) {
            if ($player['playerID'] == $playerID) {
                return $index;
            }
        }
        return -1;
    }

    /**
     * Get the ID of the next player in turn order
     *
     * @return int The ID of the next player
     */
    private function getNextPlayerId() {
        $currentPlayerIndex = $this->getPlayerIndexById($this->currentPlayer);
        $nextIndex = ($currentPlayerIndex + $this->gameOrder + count($this->players)) % count($this->players);
        return $this->players[$nextIndex]['playerID'];
    }

    /**
     * Parse a card string into color and value components
     *
     * @param string $card The card string to parse
     * @return array Associative array with color and value components
     */
    private function parseCard($card) {
        // Handle wild cards with chosen color
        if (strpos($card, 'wild') === 0 && strpos($card, '_') !== false) {
            list($cardType, $chosenColor) = explode('_', $card, 2);
            return [
                'color' => 'wild',
                'value' => $cardType,
                'chosenColor' => $chosenColor
            ];
        }

        // Regular cards: color_value format
        $parts = explode('_', $card);

        if (count($parts) < 2) {
            return [
                'color' => 'unknown',
                'value' => 'unknown'
            ];
        }

        return [
            'color' => $parts[0],
            'value' => $parts[1]
        ];
    }

    /**
     * Validate if a card can be played on the current card
     *
     * @param string $card The card to validate
     * @return bool Whether the card play is valid
     */
    private function validateCardPlay($card) {
        if (!$this->currentCard) {
            // First card in the game
            return true;
        }

        $playedCard = $this->parseCard($card);
        $currentCard = $this->parseCard($this->currentCard);

        // Wild cards can always be played
        if ($playedCard['color'] === 'wild') {
            return true;
        }

        // If current card was a wild, check against chosen color
        if ($currentCard['color'] === 'wild' && isset($currentCard['chosenColor'])) {
            return $playedCard['color'] === $currentCard['chosenColor'];
        }

        // Match by color or value
        return $playedCard['color'] === $currentCard['color'] ||
            $playedCard['value'] === $currentCard['value'];
    }

    /**
     * Check win condition
     *
     * @param int $playerID The ID of the player to check
     * @return bool Whether the player has won
     */
    public function checkWinCondition($playerID) {
        $stmt = $this->conn->prepare("SELECT cardList FROM players WHERE playerID = ?");
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        $playerData = $result->fetch_assoc();

        if (!$playerData) {
            return false;
        }

        $playerCards = json_decode($playerData['cardList'], true);
        return count($playerCards) === 0;
    }

    /**
     * Update game statistics when a player wins
     *
     * @param int $winnerID The ID of the winning player
     */
    private function updateGameStatistics($winnerID) {
        // Update lobby status
        $stmt = $this->conn->prepare("UPDATE lobby SET gameStatus = 'ended', Winner = ? WHERE gameID = ?");
        $stmt->bind_param("ss", $winnerID, $this->lobbyID);
        $stmt->execute();

        // Get winner username
        $stmt = $this->conn->prepare("SELECT playerName FROM players WHERE playerID = ?");
        $stmt->bind_param("s", $winnerID);
        $stmt->execute();
        $result = $stmt->get_result();
        $winnerData = $result->fetch_assoc();

        if ($winnerData) {
            $winnerUsername = $winnerData['playerName'];

            // Update player statistics in users table
            $stmt = $this->conn->prepare("UPDATE users SET wins = wins + 1, total_games = total_games + 1 WHERE username = ?");
            $stmt->bind_param("s", $winnerUsername);
            $stmt->execute();

            // Update other players' statistics
            foreach ($this->players as $player) {
                if ($player['playerID'] != $winnerID && !empty($player['playerName'])) {
                    $stmt = $this->conn->prepare("UPDATE users SET total_games = total_games + 1 WHERE username = ?");
                    $stmt->bind_param("s", $player['playerName']);
                    $stmt->execute();
                }
            }
        }
    }

    /**
     * Draw a random card from the deck
     *
     * @return string Random card
     */
    private function drawRandomCard() {
        $colors = ['red', 'blue', 'green', 'yellow'];
        $numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $specials = [self::CARD_SKIP, self::CARD_REVERSE, self::CARD_DRAW_TWO];
        $wilds = [self::CARD_WILD, self::CARD_WILD_DRAW_FOUR];

        $cardType = rand(1, 10);

        if ($cardType <= 7) {
            // Number card (70%)
            return $colors[array_rand($colors)] . '_' . $numbers[array_rand($numbers)];
        } elseif ($cardType <= 9) {
            // Special card (20%)
            return $colors[array_rand($colors)] . '_' . $specials[array_rand($specials)];
        } else {
            // Wild card (10%)
            return 'wild_' . $wilds[array_rand($wilds)];
        }
    }

    /**
     * Process color selection for wild cards
     *
     * @param int $playerID The ID of the player choosing the color
     * @param string $color The chosen color
     * @return array Result of the action
     */
    public function chooseColor($playerID, $color) {
        if ($playerID != $this->currentPlayer) {
            return ['success' => false, 'message' => 'Not your turn to choose color'];
        }

        $validColors = ['red', 'blue', 'green', 'yellow'];
        if (!in_array($color, $validColors)) {
            return ['success' => false, 'message' => 'Invalid color choice'];
        }

        $currentCard = $this->parseCard($this->currentCard);

        if ($currentCard['color'] !== 'wild') {
            return ['success' => false, 'message' => 'Current card is not a wild card'];
        }

        $newCardString = $currentCard['value'] . '_' . $color;

        $stmt = $this->conn->prepare("UPDATE lobby SET curCard = ? WHERE gameID = ?");
        $stmt->bind_param("ss", $newCardString, $this->lobbyID);
        $stmt->execute();

        $this->currentCard = $newCardString;

        return ['success' => true, 'message' => 'Color chosen successfully'];
    }

    /**
     * Create a test game with simulated players
     *
     * @param int $numPlayers Number of test players
     * @return int Lobby ID of the test game
     */
    public static function createTestGame($numPlayers = 4) {
        $conn = getDatabaseConnection();

        // Create a new lobby
        $stmt = $conn->prepare("INSERT INTO lobby (gameStatus, gameOrder) VALUES ('waiting', 1)");
        $stmt->execute();
        $lobbyID = $conn->insert_id;

        // Create test players
        $playerIDs = [];

        for ($i = 1; $i <= $numPlayers; $i++) {
            $username = "TestPlayer" . $i;
            $initialCards = [];

            // Give each player 7 random cards
            for ($j = 0; $j < 7; $j++) {
                $colors = ['red', 'blue', 'green', 'yellow'];
                $values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw2'];

                $color = $colors[array_rand($colors)];
                $value = $values[array_rand($values)];
                $initialCards[] = $color . '_' . $value;
            }

            $cardsJson = json_encode($initialCards);

            $stmt = $conn->prepare("INSERT INTO players (gameID, playerName, cardList) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $lobbyID, $username, $cardsJson);
            $stmt->execute();

            $playerIDs[] = $conn->insert_id;
        }

        // Set initial game state
        $initialCard = "red_5"; // Example starting card
        $stmt = $conn->prepare("UPDATE lobby SET gameStatus = 'active', curCard = ?, curPlayer = ? WHERE gameID = ?");
        $stmt->bind_param("sss", $initialCard, $playerIDs[0], $lobbyID);
        $stmt->execute();

        return $lobbyID;
    }

    /**
     * Handle a player drawing a card from the deck
     *
     * @param int $playerID The ID of the player drawing a card
     * @return array Result of the action
     */
    public function handleCardDraw($playerID) {
        // Verify it's the player's turn
        if ($playerID != $this->currentPlayer) {
            return ['success' => false, 'message' => 'Not your turn'];
        }

        // Draw a card
        $newCard = $this->drawRandomCard();

        // Get current cards
        $stmt = $this->conn->prepare("SELECT cardList FROM players WHERE playerID = ?");
        $stmt->bind_param("s", $playerID);
        $stmt->execute();
        $result = $stmt->get_result();
        $playerData = $result->fetch_assoc();

        if (!$playerData) {
            return ['success' => false, 'message' => 'Player not found'];
        }

        $playerCards = json_decode($playerData['cardList'], true);

        // Add card to player's hand
        $playerCards[] = $newCard;

        // Update database
        $cardListJson = json_encode($playerCards);
        $stmt = $this->conn->prepare("UPDATE players SET cardList = ? WHERE playerID = ?");
        $stmt->bind_param("ss", $cardListJson, $playerID);
        $stmt->execute();

        // Check if drawn card can be played
        $canPlay = $this->validateCardPlay($newCard);

        // If player can't play, move to next player
        if (!$canPlay) {
            $this->moveToNextPlayer();
        }

        return [
            'success' => true,
            'message' => 'Card drawn successfully',
            'drawnCard' => $newCard,
            'canPlay' => $canPlay
        ];
    }

    /**
     * Get basic game information
     *
     * @return array Basic game information
     */
    public function getGameInfo() {
        return [
            'lobbyID' => $this->lobbyID,
            'currentCard' => $this->currentCard,
            'currentPlayer' => $this->currentPlayer,
            'gameOrder' => $this->gameOrder,
            'gameStatus' => $this->gameStatus,
            'playerCount' => count($this->players)
        ];
    }

    /**
     * Close database connection
     */
    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}