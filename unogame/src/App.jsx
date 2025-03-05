import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from './components/MainMenu';
import PlayGame from './components/PlayGameMenu';
import TempPath from './components/TempPath';
import Tutorial from "./components/Tutorial"
import FriendList from './components/FriendList/FriendList';
import { useDeviceDetect } from './useDeviceDetect';
import GameTypeSelectMobile from './components/GameTypeSelect/GameTypeSelectMobile';
import GameTypeSelectDesktop from './components/GameTypeSelect/GameTypeSelectDesktop';
import HostGameM from './components/HostGame/HostGameM';
import HostGameD from './components/HostGame/HostGameD';
import JoinGameM from './components/JoinGameMenu/JoinGameMenuM';
import JoinGameD from './components/JoinGameMenu/JoinGameMenuD';
import WaitingRoomM from './components/WaitingRoom/WaitingRoomHostM';
import WaitingRoomD from './components/WaitingRoom/WaitingRoomHostD';

function App() {
  const { isMobile } = useDeviceDetect();

  return (
    <Router>
      <Routes>
        {/* Main Menu with Friend List */}
        <Route 
          path="/" element={<div className="main-menu-container"> <MainMenu /> <FriendList /> </div> }  />
        
        <Route 
          path="/select-game" element={ isMobile ? (  <GameTypeSelectMobile />) : ( <GameTypeSelectDesktop />)}  />

        <Route 
          path="/join-game-menu" element={isMobile ? ( <JoinGameM />) : ( <JoinGameD />)} />

        <Route 
          path="/host-game" element={isMobile ? (<HostGameM />) : (<HostGameD />)} />

        <Route 
          path="/waiting-host" element={isMobile ? ( <WaitingRoomM />) : (<WaitingRoomD />)} />

        {/* Other routes without Friend List */}
        <Route path="/play" element={<PlayGame />} />
        <Route path="/card" element={<TempPath />} />
        <Route path="/tutorial" element={<Tutorial />} />
        
      </Routes>
    </Router>
  );
}

export default App;




