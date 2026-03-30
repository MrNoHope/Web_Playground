import { Outlet, Link } from 'react-router-dom';

const ClientLayout = ({ toggleTheme, isDarkMode }) => {
  return (
    <div>
      <header className="layout-header">
        <div className="logo-text">UMT PLAYGROUND</div>
        <nav className="nav-links">
          <Link to="/" className="nav-item">Trang chủ</Link>
          <button onClick={toggleTheme} className="btn-toggle">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link to="/login" className="btn-primary">Đăng nhập</Link>
        </nav>
      </header>
      <main className="main-container">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;