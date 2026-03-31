import { Outlet, Link, useNavigate } from 'react-router-dom';

const ClientLayout = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <header className="layout-header">
        <div className="logo-text">UMT PLAYGROUND</div>
        <nav className="nav-links">
          <Link to="/" className="nav-item">Trang Chủ</Link>
          <Link to="/ranking" className="nav-item">Xếp Hạng</Link>
          {token && <Link to="/profile" className="nav-item">Hồ Sơ</Link>}
          
          <button onClick={toggleTheme} className="btn-toggle">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          {token ? (
            <button onClick={handleLogout} className="btn-primary" style={{ backgroundColor: '#ff4757' }}>Đăng xuất</button>
          ) : (
            <Link to="/login" className="btn-primary">Đăng nhập</Link>
          )}
        </nav>
      </header>
      <main className="main-container">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;