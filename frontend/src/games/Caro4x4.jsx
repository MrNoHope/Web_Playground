import { useState, useEffect } from 'react';
import axios from 'axios';

const SIZE = 10;

const Caro4x4 = ({ onBack }) => {
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (winner || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [winner, timeLeft]);

  const checkWin = (squares, index, player) => {
    const x = index % SIZE;
    const y = Math.floor(index / SIZE);
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    
    for (let [dx, dy] of directions) {
      let count = 1;
      for (let step = 1; step < 4; step++) {
        let nx = x + dx * step, ny = y + dy * step;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && squares[ny * SIZE + nx] === player) count++;
        else break;
      }
      for (let step = 1; step < 4; step++) {
        let nx = x - dx * step, ny = y - dy * step;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && squares[ny * SIZE + nx] === player) count++;
        else break;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const botMove = (cB) => {
    let e = cB.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (e.length === 0) return cB;
    let newB = [...cB];
    newB[e[Math.floor(Math.random() * e.length)]] = 'O';
    return newB;
  };

  const handleCellClick = async (index) => {
    if (winner || timeLeft <= 0 || board[index] !== null) return;
    let newB = [...board];
    newB[index] = 'X';
    
    if (checkWin(newB, index, 'X')) {
      setWinner('X (Bạn)');
      setBoard(newB);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post('http://localhost:5000/api/users/score', 
            { game_code: 'caro4', score: 100 }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (e) {
        console.log(e);
      }
      return;
    }

    newB = botMove(newB);
    let botIndex = newB.findIndex((val, idx) => val === 'O' && board[idx] !== 'O');
    if (botIndex !== -1 && checkWin(newB, botIndex, 'O')) {
      setWinner('O (Máy)');
    }
    
    setBoard(newB);
  };

  const handleRestart = () => { setBoard(Array(SIZE * SIZE).fill(null)); setWinner(null); setTimeLeft(300); };
  const handleSave = () => { localStorage.setItem('save_caro4', JSON.stringify({ board, timeLeft, winner })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_caro4');
    if (s) { const d = JSON.parse(s); setBoard(d.board); setTimeLeft(d.timeLeft); setWinner(d.winner); alert('Đã tải!'); }
  };
  const formatTime = (s) => `${Math.floor(s / 60)}:${('0' + (s % 60)).slice(-2)}`;

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '600px' }}>
      <h2 style={{ color: '#ffa502', margin: '0 0 10px 0' }}>Caro Hàng 4</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>{winner ? `Kết quả: ${winner}` : timeLeft <= 0 ? 'Hết giờ!' : 'Tới lượt bạn (X)'}</div>
        <div style={{ fontWeight: 'bold', color: timeLeft < 60 ? '#ff4757' : 'inherit' }}>Thời gian: {formatTime(timeLeft)}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 40px)`, gap: '2px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {board.map((cell, index) => (
          <div key={index} onClick={() => handleCellClick(index)} style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '24px', color: cell === 'X' ? '#0984e3' : '#ff4757', cursor: 'pointer', border: '1px solid var(--border-color)' }}>{cell}</div>
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

export default Caro4x4;