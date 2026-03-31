import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [games, setGames] = useState([
    { id: 'caro5', name: 'Caro Hàng 5', enabled: true },
    { id: 'caro4', name: 'Caro Hàng 4', enabled: true },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', enabled: true },
    { id: 'snake', name: 'Rắn Săn Mồi', enabled: true },
    { id: 'candy', name: 'Ghép Hàng 3', enabled: true },
    { id: 'memory', name: 'Cờ Trí Nhớ', enabled: true },
    { id: 'draw', name: 'Bảng Vẽ', enabled: true }
  ]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(resUsers.data);

        const resRatings = await axios.get('http://localhost:5000/api/users/ratings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRatings(resRatings.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const toggleGame = async (id, currentStatus) => {
    try {
      await axios.post('http://localhost:5000/api/users/update-game', 
        { game_code: id, enabled: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames(games.map(g => g.id === id ? { ...g, enabled: !currentStatus } : g));
    } catch (error) {
      alert('Cập nhật thất bại!');
    }
  };

  const handleReport = async (userId) => {
    try {
      await axios.post('http://localhost:5000/api/users/report', 
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === userId ? { ...u, is_reported: true } : u));
    } catch (error) {
      alert('Lỗi hệ thống');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?')) return;
    try {
      await axios.post('http://localhost:5000/api/users/delete-user', 
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter(u => u.id !== userId));
      alert('Đã xóa thành công!');
    } catch (error) {
      alert('Lỗi hệ thống');
    }
  };

  return (
    <div className="board-wrapper" style={{ alignItems: 'stretch', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>Bảng Điều Khiển Admin</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Thống Kê Hệ Thống</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tổng người dùng:</span>
            <strong style={{ fontSize: '18px', color: 'var(--accent-color)' }}>{users.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tổng lượt đánh giá:</span>
            <strong style={{ fontSize: '18px', color: '#ff4757' }}>{ratings.length}</strong>
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Quản Lý Người Dùng</h3>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>{u.username}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {u.is_reported ? (
                  <span style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '12px' }}>ĐÃ CẢNH CÁO</span>
                ) : (
                  <button onClick={() => handleReport(u.id)} style={{ background: 'none', border: '1px solid #ff4757', color: '#ff4757', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', padding: '2px 6px' }}>Báo cáo</button>
                )}
                <button onClick={() => handleDelete(u.id)} style={{ background: '#ff4757', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', padding: '2px 6px' }}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Quản Lý Bình Luận & Đánh Giá</h3>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {ratings.map(r => (
            <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', marginBottom: '5px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{r.username} ({r.game_code})</span>
                <span style={{ color: '#f1c40f' }}>{r.stars} SAO</span>
              </div>
              <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>{r.comment}</p>
            </div>
          ))}
          {ratings.length === 0 && <p>Chưa có đánh giá nào.</p>}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Bật/Tắt Trò Chơi Tới Client</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {games.map(g => (
            <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ fontWeight: 'bold' }}>{g.name}</div>
              <button 
                className="control-btn" 
                style={{ padding: '6px 15px', minWidth: '90px', backgroundColor: g.enabled ? '#ff7675' : '#55efc4', color: '#000', border: 'none' }} 
                onClick={() => toggleGame(g.id, g.enabled)}
              >
                {g.enabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;