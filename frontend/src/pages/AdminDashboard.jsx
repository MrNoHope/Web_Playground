import { useState } from 'react';

const AdminDashboard = () => {
  const [games, setGames] = useState([
    { id: 'caro5', name: 'Caro Hàng 5', enabled: true, size: 15 },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', enabled: true, size: 3 },
    { id: 'snake', name: 'Rắn Săn Mồi', enabled: false, size: 12 }
  ]);

  const toggleGame = (id) => {
    setGames(games.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  return (
    <div className="board-wrapper" style={{ alignItems: 'stretch', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>Bảng Điều Khiển Admin</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Thống Kê Nhanh</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tổng người dùng:</span>
            <strong style={{ fontSize: '18px', color: 'var(--accent-color)' }}>128</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Số trận đã chơi:</span>
            <strong style={{ fontSize: '18px', color: '#ff4757' }}>1,024</strong>
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Quản Lý Người Dùng</h3>
          <p style={{ margin: '0 0 15px 0' }}>Cảnh báo: Có 3 tài khoản bị báo cáo.</p>
          <button className="control-btn" style={{ width: '100%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>Xem Danh Sách User</button>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Quản Lý Trò Chơi</h3>
        {games.map(g => (
          <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 'bold' }}>{g.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>Kích thước bàn: <strong>{g.size}x{g.size}</strong></span>
              <button 
                className="control-btn" 
                style={{ padding: '6px 15px', minWidth: '90px', backgroundColor: g.enabled ? '#ff7675' : '#55efc4', color: '#000', border: 'none' }} 
                onClick={() => toggleGame(g.id)}
              >
                {g.enabled ? 'TẮT GAME' : 'BẬT GAME'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;