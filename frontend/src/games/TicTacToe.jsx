import { useState, useEffect } from 'react';
import axios from 'axios';

const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (winner || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [winner, timeLeft]);

  const checkWin = (sq) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
    }
    return null;
  };

  const botMove = (cB) => {
    let e = cB.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (e.length === 0) return cB;
    let nB = [...cB];
    nB[e[Math.floor(Math.random() * e.length)]] = 'O';
    return nB;
  };

  const handleCellClick = async (index) => {
    if (winner || timeLeft <= 0 || board[index]) return;
    let nB = [...board]; 
    nB[index] = 'X';
    
    let w = checkWin(nB);
    if (w === 'X') {
      setWinner('X (Bạn)');
      setBoard(nB);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post('http://localhost:5000/api/users/score', 
            { game_code: 'tictactoe', score: 100 }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (e) {
        console.log(e);
      }
      return;
    }

    if (!w) { 
      nB = botMove(nB); 
      w = checkWin(nB); 
      if (w === 'O') setWinner('O (Máy)');
    }
    setBoard(nB); 
  };

  const handleRestart = () => { setBoard(Array(9).fill(null)); setWinner(null); setTimeLeft(60); };
  const handleSave = () => { localStorage.setItem('save_ttt', JSON.stringify({ board, timeLeft, winner })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_ttt');
    if (s) { const d = JSON.parse(s); setBoard(d.board); setTimeLeft(d.timeLeft); setWinner(d.winner); alert('Đã tải!'); }
  };

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '500px' }}>
      <h2 style={{ color: '#2ed573', margin: '0 0 10px 0' }}>Tic-Tac-Toe</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>{winner ? `Kết quả: ${winner}` : timeLeft <= 0 ? 'Hết giờ!' : 'Lượt của bạn (X)'}</div>
        <div style={{ fontWeight: 'bold', color: timeLeft < 15 ? '#ff4757' : 'inherit' }}>Thời gian: {timeLeft}s</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {board.map((cell, i) => (
          <div key={i} onClick={() => handleCellClick(i)} style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px', fontWeight: 'bold', color: cell === 'X' ? '#0984e3' : '#ff4757', cursor: 'pointer', borderRadius: '4px' }}>{cell}</div>
        ))}
      </div>
      <div className="controls-group" style={{ marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="control-btn" onClick={onBack}>BACK</button>
        <button className="control-btn" onClick={handleRestart} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>CHƠI LẠI</button>
        <button className="control-btn" onClick={handleSave} style={{ backgroundColor: '#00b894', color: '#fff' }}>LƯU</button>
        <button className="control-btn" onClick={handleLoad} style={{ backgroundColor: '#fdcb6e', color: '#000' }}>TẢI</button>
      </div>
    </div>
  );
};

export default TicTacToe;