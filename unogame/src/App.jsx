import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from './components/MainMenu';
import PlayGame from './components/PlayGameMenu';
import TempPath from './components/TempPath';
import Tutorial from "./components/Tutorial"
import FriendList from './components/FriendList/FriendList';



function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu with Friend List */}
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
        <Route path="/card" element={<TempPath />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    </Router>
  );
}

export default App;




