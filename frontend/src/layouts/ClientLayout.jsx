import { Outlet, Link } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div>
      <header className="header">
        <nav>
          <Link to="/">Trang chủ (Game)</Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;