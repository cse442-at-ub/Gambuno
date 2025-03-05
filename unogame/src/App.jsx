import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from './components/MainMenu';
import PlayGame from './components/PlayGameMenu';
import TempPath from './components/TempPath';
import Tutorial from "./components/Tutorial";
import LogIn from './components/LogIn';
import CreateAccount from './components/CreateAccount'; 
import FriendList from './components/FriendList/FriendList';
import SingleGame from './components/SingleGame'

function App() {
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
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/play" element={<PlayGame />} />

      </Routes>
    </Router>
  );
}

export default App;
