import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from './components/MainMenu';
import PlayGame from './components/PlayGameMenu';
import TempPath from './components/TempPath';
import Tutorial from "./components/Tutorial";
import LogIn from './components/LogIn';
import CreateAccount from './components/CreateAccount'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<PlayGame />} />
        <Route path="/card" element={<TempPath />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
