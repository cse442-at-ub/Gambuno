-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2025 at 07:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cse442_2025_spring_team_c_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `lobby`
--

CREATE TABLE `lobby` (
  `gameID` varchar(36) NOT NULL,
  `curCard` varchar(50) NOT NULL COMMENT 'Current card in play (format: color_value)',
  `curPlayer` varchar(36) NOT NULL COMMENT 'ID of player whose turn it is',
  `cardEffect` varchar(20) DEFAULT NULL COMMENT 'Current active card effect (Draw2, Draw4, Skip, Reverse, or NULL)',
  `playerList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'List of player IDs in the game' CHECK (json_valid(`playerList`)),
  `gameOrder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Ordered queue of players determining turn order' CHECK (json_valid(`gameOrder`)),
  `gameStatus` varchar(20) DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lobby`
--

INSERT INTO `lobby` (`gameID`, `curCard`, `curPlayer`, `cardEffect`, `playerList`, `gameOrder`, `gameStatus`) VALUES
('1', 'null', 'null', 'null', 'null', 'null', 'waiting'),
('2\\\\r\\\\n', 'red_9', 'test_player_1', '', '[\"test_player_1\"]', '[\"test_player_1\"]', 'waiting'),
('4\\r\\n', 'blue_5', 'player_9253', '', '[\"player_9253\"]', '[\"player_9253\"]', 'waiting'),
('5\\r\\n', 'yellow_6', 'player_1284', '', '[\"player_1284\"]', '[\"player_1284\"]', 'waiting'),
('6\\\\r\\\\n', 'yellow_4', 'test_player_1', '', '[\"test_player_1\"]', '[\"test_player_1\"]', 'waiting'),
('7', 'yellow_1', 'test_player_1', '', '[\"test_player_1\",\"test_player_2\",\"test_player_3\"]', '[\"test_player_1\"]', 'inProgress'),
('789799', 'red_8', 'test_player_1', '', '[\"test_player_1\",\"test_player_2\",\"test_player_3\",\"test_player_4\"]', '[\"test_player_1\"]', 'inProgress'),
('8', 'green_8', 'test_player_1', '', '[\"test_player_1\",\"test_player_2\",\"test_player_3\",\"test_player_4\"]', '[\"test_player_1\"]', 'inProgress'),
('my_game_123\\r\\n', 'green_6', 'player_1567', '', '[\"player_1567\"]', '[\"player_1567\"]', 'waiting'),
('test_game_123\\\\r\\\\n', 'yellow_3', 'test_player_1', '', '[\"test_player_1\"]', '[\"test_player_1\"]', 'waiting'),
('test_game_3\\\\r\\\\n', 'blue_2', 'test_player_1', '', '[\"test_player_1\"]', '[\"test_player_1\"]', 'waiting');

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `gameID` varchar(36) NOT NULL,
  `playerID` varchar(36) NOT NULL,
  `playerName` varchar(50) DEFAULT NULL,
  `cardList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'List of cards in player hand' CHECK (json_valid(`cardList`)),
  `placedCard` varchar(50) DEFAULT NULL COMMENT 'Card the player is attempting to place',
  `skipped` tinyint(1) DEFAULT 0 COMMENT 'Whether player should be skipped on their next turn'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `gameID`, `playerID`, `playerName`, `cardList`, `placedCard`, `skipped`) VALUES
(1, '1', '1', NULL, '[\"red_1\",\"blue_2\",\"green_3\",\"yellow_4\"]', '\"blue_2\"', 0),
(2, '2\\\\r\\\\n', 'test_player_1', 'Test Player 1', '[\"yellow_7\",\"blue_3\",\"yellow_3\",\"wild_Draw4\",\"wild_Draw4\",\"blue_7\",\"wild_Wild\"]', '', 0),
(3, 'my_game_123\\r\\n', 'player_1567', 'Eve27', '[\"green_0\",\"wild_Draw4\",\"wild_Wild\",\"green_6\",\"red_0\",\"yellow_9\",\"blue_4\"]', '', 0),
(4, '4\\r\\n', 'player_9253', 'Eve21', '[\"green_7\",\"yellow_8\",\"red_3\",\"blue_1\",\"blue_1\",\"yellow_6\",\"wild_Wild\"]', '', 0),
(5, '5\\r\\n', 'player_1284', 'Eve27', '[\"blue_3\",\"green_Draw2\",\"yellow_5\",\"wild_Draw4\",\"blue_Skip\",\"wild_Draw4\",\"green_1\"]', '', 0),
(6, '6\\\\r\\\\n', 'test_player_1', 'Test Player 1', '[\"yellow_3\",\"wild_Wild\",\"blue_4\",\"yellow_3\",\"wild_Draw4\",\"wild_Draw4\",\"wild_Draw4\"]', '', 0),
(7, '7', 'test_player_1', 'Test Player 1', '[\"red_2\",\"green_Draw2\",\"blue_Reverse\",\"green_4\",\"red_8\",\"blue_4\",\"yellow_3\"]', '', 0),
(8, '7', 'test_player_2', 'Test Player 2', '[\"wild_Draw4\",\"green_Draw2\",\"blue_6\",\"wild_Draw4\",\"green_3\",\"red_6\",\"blue_0\"]', '', 0),
(9, '7', 'test_player_3', 'Test Player 3', '[\"yellow_2\",\"green_8\",\"red_0\",\"yellow_8\",\"green_9\",\"wild_Draw4\",\"wild_Wild\"]', '', 0),
(10, '8', 'test_player_1', 'Test Player 1', '[\"blue_9\",\"red_0\",\"yellow_Skip\",\"red_5\",\"red_7\",\"red_1\",\"wild_Wild\"]', '', 0),
(11, '8', 'test_player_2', 'Test Player 2', '[\"blue_3\",\"yellow_6\",\"yellow_Draw2\",\"yellow_9\",\"yellow_Skip\",\"blue_Reverse\",\"wild_Draw4\"]', '', 0),
(12, '8', 'test_player_3', 'Test Player 3', '[\"yellow_4\",\"green_1\",\"blue_Reverse\",\"yellow_7\",\"blue_9\",\"wild_Draw4\",\"yellow_Draw2\"]', '', 0),
(13, '8', 'test_player_4', 'Test Player 4', '[\"yellow_8\",\"yellow_8\",\"wild_Wild\",\"blue_7\",\"blue_9\",\"red_4\",\"green_9\"]', '', 0),
(14, '789799', 'test_player_1', 'Test Player 1', '[\"blue_Reverse\",\"blue_9\",\"red_3\",\"yellow_2\",\"green_Draw2\",\"red_9\",\"red_Skip\"]', '', 0),
(15, '789799', 'test_player_2', 'Test Player 2', '[\"blue_4\",\"red_Draw2\",\"wild_Draw4\",\"blue_4\",\"wild_Wild\",\"yellow_8\",\"green_9\"]', '', 0),
(16, '789799', 'test_player_3', 'Test Player 3', '[\"wild_Draw4\",\"green_6\",\"green_Reverse\",\"blue_4\",\"green_7\",\"red_Reverse\",\"blue_8\"]', '', 0),
(17, '789799', 'test_player_4', 'Test Player 4', '[\"blue_1\",\"yellow_1\",\"red_8\",\"wild_Wild\",\"wild_Draw4\",\"wild_Wild\",\"blue_8\"]', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `name` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lobby`
--
ALTER TABLE `lobby`
  ADD PRIMARY KEY (`gameID`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `game_player` (`gameID`,`playerID`),
  ADD KEY `idx_game_player` (`gameID`,`playerID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`gameID`) REFERENCES `lobby` (`gameID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
