<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'auth.php';

$host = "localhost";
$user = "kurianva";
$pass = "50554678";
$dbname = "cse442_2025_spring_team_c_db";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);

function insertUser($data, $conn) {

    if (isset($data['username']) && isset($data['password'])) {
        $username = $data['username'];
        $password = $data['password'];
        $authToken = bin2hex(random_bytes(16)); // 80 bits of entropy
        $hashedAuthToken = password_hash($authToken, PASSWORD_BCRYPT);
        if (!checkAuthDetails($username, $password)) {
            echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
            return;
        }

        else{
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            setcookie("auth", $authToken, time() + 3600, "/", "cse.buffalo.edu", true, true);

            $sql = "INSERT INTO users (username, hashed_password, auth) 
                    VALUES (:?, :?, :?)";
            $prep =  $conn->prepare($sql);

            $prep->bind_param("sss", $username, $hashedPassword, $hashedAuthToken);

            if ($prep->execute()) {
                echo json_encode(["status" => "success", "message" => "User created successfully"]);
            } else {
                // Provide detailed error information
                echo json_encode(["status" => "error", "message" => "User creation failed: " . $prep->error]);
            }



//            $prep->execute([
//                ':username' => $username,
//                ':hashedPassword' => $hashedPassword,
//                ':hashedAuthToken' => $hashedAuthToken
//            ]);
//
//            if ($prep->affected_rows > 0) {
//                echo "User inserted successfully!";
//            } else {
//                echo "Error inserting user.";
//            }
        }
        $prep->close();
    }
else {
        echo json_encode(["status" => "error", "message" => "check"]);
    }
    $conn->close();
}

insertUser($data, $conn);

?>



/*
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);
setcookie("auth", $authToken, time() + 3600, "/", "cse.buffalo.edu", true, true);

$sql = "INSERT INTO users (username, hashed_password, auth) VALUES ('$username', '$hashedPassword', '$hashedAuthToken')";

if ($conn->query($sql) === TRUE) {
echo json_encode(["status" => "success", "message" => "User created successfully"]);
}
else {
echo "User creation failed";
}
}

if ($conn->query($sql) === TRUE) {
echo json_encode(["status" => "success", "message" => "User created successfully"]);
}
else {
echo "User creation failed";
}
*/
