import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div>
      <header className="header admin-header">
        <nav>
          <Link to="/admin">Admin Dashboard</Link>
          <Link to="/">Về trang Client</Link>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;