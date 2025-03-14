<?php
/**
 * Post data to server based on action type
 * 
 * @param string $action The action to perform (e.g., "join", "host")
 * @param string $jsonData JSON string containing the data for the action
 * @return array Response with status and message
 */
function postDataToServer($action, $jsonData) {
    // Decode the JSON data
    $data = json_decode($jsonData, true);
    
    // Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [
            'status' => 'error',
            'message' => 'Invalid JSON data: ' . json_last_error_msg()
        ];
    }
    
    // Validate required fields based on action
    $requiredFields = [];
    switch ($action) {
        case 'join':
            $requiredFields = ['gameID', 'userID', 'authToken'];
            break;
        case 'host':
            $requiredFields = ['gameID', 'hostID', 'authToken', 'gameMode'];
            break;
        default:
            return [
                'status' => 'error',
                'message' => 'Invalid action: ' . $action
            ];
    }
    
    // Check if all required fields are present
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return [
                'status' => 'error',
                'message' => 'Missing required field: ' . $field
            ];
        }
    }
    
    // Connect to the database
    $conn = connectToDatabase();
    if (!$conn) {
        return [
            'status' => 'error',
            'message' => 'Failed to connect to database'
        ];
    }
    
    // Process based on action type
    switch ($action) {
        case 'join':
            return handleJoinAction($conn, $data);
        case 'host':
            return handleHostAction($conn, $data);
        default:
            return [
                'status' => 'error',
                'message' => 'Invalid action: ' . $action
            ];
    }
}

/**
 * Handle the "join" action
 * 
 * @param resource $conn Database connection
 * @param array $data The data for the join action
 * @return array Response with status and message
 */
function handleJoinAction($conn, $data) {
    // Validate auth token
    if (!validateAuthToken($data['userID'], $data['authToken'])) {
        return [
            'status' => 'error',
            'message' => 'Invalid authentication token'
        ];
    }
    
    // Check if game exists
    $gameExists = checkGameExists($conn, $data['gameID']);
    if (!$gameExists) {
        return [
            'status' => 'error',
            'message' => 'Game does not exist'
        ];
    }
    
    // Get current player list
    $playerListJson = getPlayerList($conn, $data['gameID']);
    $playerList = json_decode($playerListJson, true);
    
    // Check if player is already in the game
    if (isset($playerList['playerlist'][$data['userID']])) {
        return [
            'status' => 'error',
            'message' => 'User already in game'
        ];
    }
    
    // Add player to the player list
    $playerList['playerlist'][$data['userID']] = $data['userID'];
    
    // Update player list in database
    $updatedPlayerListJson = json_encode($playerList);
    $updateResult = updatePlayerList($conn, $data['gameID'], $updatedPlayerListJson);
    
    if ($updateResult) {
        return [
            'status' => 'success',
            'message' => 'Successfully joined game',
            'gameID' => $data['gameID'],
            'playerList' => $playerList
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'Failed to join game'
        ];
    }
}

/**
 * Handle the "host" action
 * 
 * @param resource $conn Database connection
 * @param array $data The data for the host action
 * @return array Response with status and message
 */
function handleHostAction($conn, $data) {
    // Validate auth token
    if (!validateAuthToken($data['hostID'], $data['authToken'])) {
        return [
            'status' => 'error',
            'message' => 'Invalid authentication token'
        ];
    }
    
    // Check if game with same ID already exists
    $gameExists = checkGameExists($conn, $data['gameID']);
    if ($gameExists) {
        return [
            'status' => 'error',
            'message' => 'Game with this ID already exists'
        ];
    }
    
    // Create initial player list with host
    $playerList = [
        'gameId' => $data['gameID'],
        'playerlist' => [
            'hostId' => $data['hostID']
        ]
    ];
    
    $playerListJson = json_encode($playerList);
    
    // Create game in database
    $gameSettings = [
        'gameMode' => $data['gameMode'],
        'customRules' => isset($data['customRules']) ? $data['customRules'] : []
    ];
    
    $gameSettingsJson = json_encode($gameSettings);
    
    $createResult = createGame($conn, $data['gameID'], $playerListJson, $gameSettingsJson);
    
    if ($createResult) {
        return [
            'status' => 'success',
            'message' => 'Successfully created game',
            'gameID' => $data['gameID'],
            'playerList' => $playerList,
            'gameSettings' => $gameSettings
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'Failed to create game'
        ];
    }
}

/**
 * Connect to the database
 * 
 * @return resource|false Database connection or false on failure
 */
function connectToDatabase() {
    // Replace with your actual database connection code
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";
    
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        return false;
    }
    
    return $conn;
}

/**
 * Validate authentication token
 * 
 * @param string $userID User ID
 * @param string $authToken Authentication token
 * @return bool True if valid, false otherwise
 */
function validateAuthToken($userID, $authToken) {
    // Replace with your actual authentication logic
    // This is a placeholder
    return true;
}

/**
 * Check if a game exists
 * 
 * @param resource $conn Database connection
 * @param string $gameID Game ID
 * @return bool True if exists, false otherwise
 */
function checkGameExists($conn, $gameID) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM games WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_row()[0];
    $stmt->close();
    
    return $count > 0;
}

/**
 * Get player list for a game
 * 
 * @param resource $conn Database connection
 * @param string $gameID Game ID
 * @return string JSON string of player list
 */
function getPlayerList($conn, $gameID) {
    $stmt = $conn->prepare("SELECT playerList FROM games WHERE gameID = ?");
    $stmt->bind_param("s", $gameID);
    $stmt->execute();
    $result = $stmt->get_result();
    $playerList = $result->fetch_row()[0];
    $stmt->close();
    
    return $playerList;
}

/**
 * Update player list in the database
 * 
 * @param resource $conn Database connection
 * @param string $gameID Game ID
 * @param string $playerListJson JSON string of player list
 * @return bool True on success, false on failure
 */
function updatePlayerList($conn, $gameID, $playerListJson) {
    $stmt = $conn->prepare("UPDATE games SET playerList = ? WHERE gameID = ?");
    $stmt->bind_param("ss", $playerListJson, $gameID);
    $result = $stmt->execute();
    $stmt->close();
    
    return $result;
}

/**
 * Create a new game in the database
 * 
 * @param resource $conn Database connection
 * @param string $gameID Game ID
 * @param string $playerListJson JSON string of player list
 * @param string $gameSettingsJson JSON string of game settings
 * @return bool True on success, false on failure
 */
function createGame($conn, $gameID, $playerListJson, $gameSettingsJson) {
    $stmt = $conn->prepare("INSERT INTO games (gameID, playerList, gameSettings) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $gameID, $playerListJson, $gameSettingsJson);
    $result = $stmt->execute();
    $stmt->close();
    
    return $result;
}

?>