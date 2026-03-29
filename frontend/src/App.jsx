import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import BoardGame from './pages/BoardGame';
import Login from './pages/Login';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <button className="theme-btn" onClick={toggleTheme}>
          {isDarkMode ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
        </button>
        
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<BoardGame />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;