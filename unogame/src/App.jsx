import React from 'react';
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from './components/MainMenu.jsx';
import PlayGame from './components/PlayGameMenu.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<PlayGame />} />
      </Routes>
    </Router>
  );
}

export default App;
