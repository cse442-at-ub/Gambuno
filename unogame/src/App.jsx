import React from 'react';
        import { HashRouter as Router, Route, Routes } from 'react-router-dom';
        import MainMenu from './components/MainMenu';
        import PlayGame from './components/PlayGameMenu';
        import TempPath from './components/TempPath';
        import LogIn from './components/LogIn';
        import CreateAccount from './components/CreateAccount';
        import FriendList from './components/FriendList/FriendList';
        import SingleGame from './components/SingleGame';
        import { useDeviceDetect } from './useDeviceDetect';
        import GameTypeSelectMobile from './components/GameTypeSelect/GameTypeSelectMobile';
        import GameTypeSelectDesktop from './components/GameTypeSelect/GameTypeSelectDesktop';
        import HostGameM from './components/HostGame/HostGameM';
        import HostGameD from './components/HostGame/HostGameD';
        import JoinGameM from './components/JoinGameMenu/JoinGameMenuM';
        import JoinGameD from './components/JoinGameMenu/JoinGameMenuD';
        import WaitingRoomM from './components/WaitingRoom/WaitingRoomHostM';
        import WaitingRoomD from './components/WaitingRoom/WaitingRoomHostD';
        import SettingsPopup from "./components/SettingsPopup";
        import HostGameLobby from './components/HostGameLobby/HostGameLobbyD';
        import Leaderboard from './components/leaderboard'; // Import Leaderboard component

        function App() {

          const { isMobile } = useDeviceDetect();

          return (
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="main-menu-container">
                      <MainMenu />
                      <FriendList /> {/* Add FriendList here */}
                    </div>
                  }
                />
                {/* Other routes without Friend List */}
                <Route path="/play" element={<PlayGame />} />
                <Route path="/single-game" element={<SingleGame />} />
                <Route path="/card" element={<TempPath />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/select-game" element={isMobile ? (<GameTypeSelectMobile />) : (<GameTypeSelectDesktop />)} />
                <Route path="/join-game-menu" element={isMobile ? (<JoinGameM />) : (<JoinGameD />)} />
                <Route path="/host-game" element={isMobile ? (<HostGameM />) : (<HostGameD />)} />
                <Route path="/waiting-host" element={isMobile ? (<WaitingRoomM />) : (<WaitingRoomD />)} />
                <Route path="/host-game-lobby/:gameCode" element={<HostGameLobby />} />
                <Route path="/leaderboard" element={<Leaderboard />} /> {/* Add Leaderboard route */}
              </Routes>
            </Router>
          );
        }

        export default App;