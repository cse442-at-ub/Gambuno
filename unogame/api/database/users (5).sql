-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 27, 2025 at 09:43 PM
-- Server version: 8.0.39-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.18

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` text NOT NULL,
  `hashed_password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `auth` text,
  `money` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `hashed_password`, `auth`, `money`) VALUES
('test2222222222', '$2y$10$91eT/OVoZSWdUxHuFsEhoOYnbngQ8T6OYug3/jo9PpDis5BAC6k/q', '', NULL),
('heloo1234', '$2y$10$IS.oI/wt5pCMcx0vSNApqO323avMj6WoQzIH1qd0kddygMjZRwEsa', '', NULL),
('hellouser', '$2y$10$0A3kd0mYAWDvYRNbEztFje1HY1N4DqajlB0L7Z9ZhSgXnhT7b//G.', '', NULL),
('kurian34567', '$2y$10$zedVvjBcgtmQqMzPqym0EOwiB6qug6ZOfsJhwB7c.2POAouRg962.', '', NULL),
('test123456', '$2y$10$5LdD2zFnmb0TQo/iCtSDbuJFh1SI0iuFBQ3oPQcihakUjBI37rqxK', '', NULL),
('mathewleygo', '$2y$10$2ALocXtbTsCxQXDG9zjEBOktj.1OP.HxWwONnB3Pr1qf4r4/13jpG', '', NULL),
('kurianvadakara', '$2y$10$hlt2QUQ3gf3lSVbWB6vNC.nFW2OQDFpewKgbi5ah6TP4q7NMcaOcu', '', NULL),
('mathew1jenfjd', '$2y$10$ftwURjjaGZFRjQ/FlwCfg.VwlR6EVpsEvdIdcR/W44fpLo64tCvVO', '', NULL),
('kurianafjncnd', '$2y$10$y3u4gw84Ci.8lotCq858ru4lIYvDJKymSwP29S2Vw1R3nmreaQO4a', '', NULL),
('kiejfjnefjen', '$2y$10$7Oz6FsBi3DbbfvbY/asKu.9wv.tdQNBYRsu.KBEhpVIC9D22oS5me', '', NULL),
('mathew456', '$2y$10$0KsR1M0QARIgHMYwlUEKu.UbxJ7kgvMsfIFaeQG8pCAHAPEAGvrSa', '', NULL),
('hdjcndcnjd', '$2y$10$v/xyCAcC2zIP4qf75dyep.CUfnSvEV0wCcODbkc7.VFvRMY3xPfC2', '', NULL),
('mathewhbjk', '$2y$10$IqvSkuhF1xBEBM2bAi2GkucPs7jiN5IPwa.CxNrTuvu2QVFoPKiIm', '', NULL),
('kurianfndjn', '$2y$10$MEVYFexg.fmVbxF3MleW3OWMSGGhJq9t5JTx.ndBuW6w6PQdywJxK', '', NULL),
('mathew12334', '$2y$10$EiRwllBSPVx6WL9Y3P3kQOUq5D3iP2A7UpNMLKC7wppSt/Hmg4NSi', '', NULL),
('mathew123343', '$2y$10$86GDs7OrL1sB5HbfZIQeJOGMuEe3HMhecZP4I4NosM29pYuMfNzhm', '', NULL),
('mathewmaaa', '$2y$10$C0uLUEq1lJZMaF7odYVenulolR8U8k21xVIgjZFPBHpAiuF9PhIIK', '', NULL),
('mathewmaaa', '$2y$10$zmiP7fb.2ic.17JCLlO6OOrin8yM3R/HFanXQYk49ue4Dy1NivBCK', '', NULL),
('mathewphipl', '$2y$10$fkU6qNLID1YPE9ks/lg3jOEU6ZhzbrnoFJngk4PGyotj68ZljMiSu', '', NULL),
('dxcfbhkjlvf', '$2y$10$2BWMmboVI5QQOeD7KGGq.O8bKUqRN4pxtOlap7f01L0/A6y6Nvguq', '$2y$10$rnvudYWe38Eb.OjLA21o4uYQYauilfbdJgmnhHktZEdPf9S51ZqoK', NULL),
('vdfjvndfjd', '$2y$10$LBVx5dp65zaADSLhtWbD4.ZOip24YvGL0E9uSHtNWvJPJzZqNJMB6', '$2y$10$2F6mxmWwAKHlOFBdgGcNRu5M6w.4BmhIK6G1y3JRI3IYQZNQajGZW', NULL),
('kurianva', '$2y$10$LHwRUsWHc5nXrISEZ7PPCufCQdLxGyShqzVzOg/z76Ldt6zQJgNz2', '$2y$10$C2N3XIKFbb3yAnzS24T.dOoW4UtSo37Js9VIQ1KeM.ZNFqO3PA5mG', NULL),
('mathew12', '$2y$10$DevJ8jofhJmc0VEWaly0C.6eVsEOrrgZua.WDC7wDIsg1e15nnknW', '$2y$10$XaSWIYzIpvsaTrOBrkYOPugGKLqd9iS.9gH2g6YSxc/Hq16nINncK', NULL),
('root12345', '$2y$10$FjcGA6AY.oyUdF1FAwYBH.P1chnq6N2zEWzB14ms5MvuKg3AG8Fsa', '$2y$10$vyqPjXX.1mOn6/9tgqVAh.vfOHTTqPtBeR7xudF4FdfGQPl.KCxxW', NULL),
('mathew123', '$2y$10$/Gwg2gCXwVWwZM6aZosX/OG4uggNostXgbgpDhJ7ew/SYOe7lL/.6', '$2y$10$Wi5O3FD6FznwqdyNdav4h.4Z9EtxxOKt2WZUYEAgVeUCQMjIhwsR2', NULL),
('Unoplayer123', '$2y$10$EXnehNIpe..muB8eaRXacOAqn4wmu3Rm59cEWzSwAW7zmoEuSHT0u', '$2y$10$bsjj/xGJDvi956dIDL3mQO4FVK8xNwx/M9NiHYIwnN8h1qmyJXwlG', NULL),
('wethebestmusic', '$2y$10$HQSDLxh9fLqwtfUMPvgWR.SAc4Uvz1sYM4CVPJdvHGkbLlzbLTrT2', '$2y$10$uf.3yJh.W.JJM3Y6OogyQuT/R8mEgWc2a4clMARlH/ypejjw3/Qxu', NULL),
('james101', '$2y$10$y88v/MzCuALzRsvJdpkFS./2tm3NgikXaVxb60739NttEszofCPMK', '$2y$10$S4CTkzme.21K7GW3EawoO.dtZlIjzav7wmnzhp/ERND43I2pHOK0G', NULL),
('1234567890', '$2y$10$PN3JjOsPCDsnFP6gUboqGuRMHlMBQWKUWrWRI2zyx.HtSDfqUcyYq', '$2y$10$5nQsAeQG0qHBGhAqvoFSAuWrKWm/T3BBpEErzxA.CiuvsufQbZFk.', NULL),
('james101', '$2y$10$AAYhJqFTVBfvFY/USvucbOSotKGeVpPVku0kzN9J4IXPoFRSBjjI2', '$2y$10$.lXxNU5kuNLzkgbTEDUPveCYkZm.eikYuR.biUS31mWzem72ZSgyO', NULL),
('kurianva', '$2y$10$hVGUM6f6f8EWie8N6tu6z.UEYoXUDWBLcBLahbUx2iJjrPewGclBK', '$2y$10$CxM1kTCMBvAgMetWej7CFOx2iIACEaqNmDpbm3ybFOxLG0MLqNgee', NULL),
('whatintheworld', '$2y$10$Ryf60T7K.CTwPmYVGCdgw.TWfrvwEtVXVGCWVvmhcqZeOTIq2mMRu', '$2y$10$71xABeUEVzc5tr5IYojrgeWS3gT1EoBMw4Y6m0Clx4S2j0FnfvkhK', NULL),
('whatintheworld', '$2y$10$R6Z7hukye4aib0TUpEOFKu.RLRRsNuqJ1WVDRCLyLml1ofnvCVZMW', '$2y$10$uxw8.ro8Emt7Po/3Y1GMeeFQ7s9gvXyKhevjr498/El9UKCldeYn6', NULL),
('mkxd1457', '$2y$10$nwyKmaXa6l/jCrmIUDSi0uDC4HtImMXjsvYOjeToczfNbgTbn0xaK', '$2y$10$Pi901UbPy3pRYGOXbKQof.SPz9t.9lKlCpUAp.szU1vfk/6defhkO', NULL),
('welcome1', '$2y$10$oCZyj.kkC4.5L4.pcvXayeSWbFiGVg/SVwJI5X0hDVPP0p3Ry4GPO', '$2y$10$woi4hU01qaxuKaiG9BVPO.oFyPIhLEpwexAqgf0FK9lzDPtKI07ZC', NULL),
('welcome1', '$2y$10$rAMLilNtfqVrZdTFfTtauu1xd68qfYnGD.MPREKctmg2fbxd5rgFi', '$2y$10$oOsJut74.RyDDeCSG4WHA..oy.8ZGZRILW6EA5qv1GyA.tbnAj9Vm', NULL),
('welcome1', '$2y$10$1Wa0pSbyWHmqjimT4fKlVeLB4cQH2vuNHhHlHMnNMpTeT2FVexFje', '$2y$10$kDTKaKKy9.N8ZfsxIxdZcu0feR/UrUOp5JMhIZ1eGTGGCLqa/ylCG', NULL),
('welcome1', '$2y$10$h0maxTmOvQxZMnXsnqhEpOU3lRNvygVqEXaPDEDBZJYm8BcL2NI6.', '$2y$10$BKujyvPtXSt05JUA6xhD6uQxdMpKaN7v.TMV6aAMYiTBWQLsDOYfG', NULL),
('robertpatti', '$2y$10$MMqEOo1CAWHTXQHgJRZ7oOB09utQhd7Qxc7ILGpXb5u2UnSSoQRT.', '$2y$10$ReUiQ.gepNkI6q6YHPN5KO/4P7maNc/Mf7mJiY4qhUAAeXH2TSkjW', NULL),
('robertpatti', '$2y$10$/7XfNDaFepGet3f5d6RL..O8QdoRt/Ncx4u4z5Q3naQfpk9FYkDO2', '$2y$10$Neqfsu8NwiDv3k.9vET3eOOzpzucOXMvCrLsUaeeiLvGHSnYhH1hC', NULL),
('welcome1', '$2y$10$fFTknlBOz4lCIDCtpeeCZuOnUTzM16h5OJLYoDxN80NIuZvRRaHGO', '$2y$10$vLqy1B8BY3gU7Vct9cZHqOMNDfQ.u3Ke8bOV7rGj9x2E2lhnKIdU2', NULL),
('root12345', '$2y$10$bYV0Je26gLbYrOpVOv9KaeqqG3niWP9f3cHdI4MTCgpURS3YwSQGC', '$2y$10$5dYwj7tSn2eSIwss8G6g6Oj2unQvkMjD4x1x294BZxyd5LRoAbRU6', NULL),
('kurianva', '$2y$10$MpU3NdAfXVaEX9eUPVdagOcnB3af9lM4von86KsgNZRH3Xnf/sDOe', '$2y$10$ncIplaWI0VLb5CHttOpKAeW/kA2sbY.zkLMaSABAFxIRBzJkZ12z.', NULL),
('jerin1234', '$2y$10$Wnav7l6RgMsCKWeyQX9n7eNjZUZTsDzqD3p.fOmF10Op3IWCEVq3.', '$2y$10$7iNDDGXzhEF2uCdiTh/eeuCD/WAOjCgg.W25kQrRNBktoW/Nb7I32', NULL),
('jerin123', '$2y$10$ULFE4ZdiRetbaapTgDnX6Oh9T0UvYndjFGrkOL2OI889F8Lg5Fa46', '$2y$10$GZkNteGZ5rccjzSkbYNz1.Fi3dI81Z1yXlqs1OaPRpyOOxKHKvauu', NULL),
('jerin234', '$2y$10$HcR.nAEeT1Kymg4ZHG7xJeMqvILUf3EG7y2UZtmZQ2R3IYIqAGlxm', '$2y$10$Bs/uzP.Q9JN9hKM1lYbjvOPeu2Ba0o9Zsvf/PHmZArL1MY4XTMDZu', NULL),
('jerin345', '$2y$10$t3pQVMKTyI7EtWlVNuwkQ.JC.RCzAGlaQkiWQS39EKa2Exo1Iddwa', '$2y$10$0UfZwvIoYAGoYaywGbaOTuY97ETkcuKcecZhgdmVC8e1YuLilT2wi', NULL),
('robertpatti', '$2y$10$bse4D5hmsTl7WhjTHNSZBOUfM3L4myMc8j7pcg3BnWdWu9h3OJeDy', '$2y$10$.wb.vCck4SelGoR.uxUiYu24oGdMaa9zciOsmvDxDFaosIKz5xp8a', NULL),
('newuser12', '$2y$10$qbVAJ64u3R8WWK/0h.QkbeecnxhTGdZWPK6II8FCFqAYkKcQdJ0B.', '$2y$10$LmwJ1lbx3eEcfVNighcPhOmXkW7WohQYi4NQ.9WwHLSReJ08AM4RO', NULL),
('Unoplayer1', '$2y$10$dJDnMe9NPe3vAnbmW5X6SOKIZUO5raPibjvaI2s7izKysWm2GBq4K', '$2y$10$WuuHXKxzF5a0J2OUuf.jyum4Wh94SOdXyjsPtWFVZsYj..G5Oqtwm', NULL),
('hellopeter', '$2y$10$7ReUm3QheU3AV9YmGnYdbON.Kw3V1DDEELnrQ4m6yxvNShmidqolW', '$2y$10$gHDWHO7BWI9tS2C1SOKuoeEeCSoM/2XlNbPw4ucu6gGviRrprPWqi', '1500.00'),
('Justinva', '$2y$10$qQONJs0XfRYPG54c9tlMYefKRmNugrL5l9vRtz.JtSWodVXq/dV7i', '$2y$10$Rqsq/8R6dTnq01zWnzINUO63OgIQ4PLPNdCqH1NfLanhPbILH9dD.', '1500.00'),
('kurianva', '$2y$10$vPdjl6f9Gf1ONYqQDZEeU.icsSe.7C3n5/xOI7zSu95nxGFYnmyJy', '$2y$10$mLLUk/Gy/iFFJQlEzoKCxufm4sSysVimBaOwffZX6TA6UJJ5vo98a', '1500.00'),
('hellophu', '$2y$10$Vv1gHr20ES7EDWxvKoEW1OEbryl61HcXJcMOQdTlRybYTuzglxU5W', '$2y$10$43YZJuuPiJeqgTQU1sxsXe.LY02ZyfyeGmGOAg5HpesVYOBYmXH5W', '1500.00'),
('mathew1234566', '$2y$10$HMR7x4NWubNj5cvThNtaJeAavXDDnOigRO0jy29B46IT8JRysqIxi', '$2y$10$.ligj1hHeaNsYzndojMxqeKo0ItIzFRhKY.1Ge7shhI5hnd5Sug0S', '1500.00'),
('petermath', '$2y$10$M1MZJn8sMm5Z60M6kFWzGeUmw.DB0EolhWa1IvJ3OspsqMGVPYEyK', '$2y$10$cEUSPprspPa2qPZZ1ZoNX.qZi5alCvCs5/uQFlJ12.NKyibxFZoE.', '1500.00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
