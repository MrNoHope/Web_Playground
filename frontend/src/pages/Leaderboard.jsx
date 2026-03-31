import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/users/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScores(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="board-wrapper" style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>Bảng Xếp Hạng Toàn Hệ Thống</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--matrix-bg)', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Hạng</th>
            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Người Chơi</th>
            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Trò Chơi</th>
            <th style={{ padding: '12px', borderBottom: '2px solid var(--border-color)' }}>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{i + 1}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.username}</td>
              <td style={{ padding: '12px', textTransform: 'uppercase' }}>{s.game_code}</td>
              <td style={{ padding: '12px', color: '#ff4757', fontWeight: 'bold' }}>{s.score}</td>
            </tr>
          ))}
          {scores.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Chưa có dữ liệu. Hãy chơi game và lưu điểm!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;