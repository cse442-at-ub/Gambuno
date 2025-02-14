import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import MainMenu from './components/MainMenu.tsx';
import PlayGame from './components/PlayGameMenu.tsx';

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
