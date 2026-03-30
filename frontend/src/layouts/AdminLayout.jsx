import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', color: '#333' }}>
      <header style={{ 
        backgroundColor: '#2c3e50', 
        padding: '15px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ecf0f1' }}>
          ⚙️ UMT ADMIN PORTAL
        </div>
        <nav>
          <Link to="/" style={{ 
            backgroundColor: '#e74c3c', 
            color: '#fff', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(231, 76, 60, 0.4)'
          }}>
            ⬅ TRỞ VỀ CLIENT
          </Link>
        </nav>
      </header>
      
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;