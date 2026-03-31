import { useState, useEffect } from 'react';
import axios from 'axios';

const SIZE = 15;

const Caro5x5 = ({ onBack }) => {
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);

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
      for (let step = 1; step < 5; step++) {
        let nx = x + dx * step, ny = y + dy * step;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && squares[ny * SIZE + nx] === player) count++;
        else break;
      }
      for (let step = 1; step < 5; step++) {
        let nx = x - dx * step, ny = y - dy * step;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && squares[ny * SIZE + nx] === player) count++;
        else break;
      }
      if (count >= 5) return true;
    }
    return false;
  };

  const saveFinalScore = async (scoreValue) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/api/users/score', 
          { game_code: 'caro5', score: scoreValue }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCellClick = async (index) => {
    if (winner || timeLeft <= 0 || board[index] !== null) return;
    let newB = [...board];
    newB[index] = 'X';
    if (checkWin(newB, index, 'X')) {
      setWinner('X (Bạn)');
      setBoard(newB);
      await saveFinalScore(200);
      return;
    }
    let empty = newB.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length > 0) {
      let bIdx = empty[Math.floor(Math.random() * empty.length)];
      newB[bIdx] = 'O';
      if (checkWin(newB, bIdx, 'O')) setWinner('O (Máy)');
    }
    setBoard(newB);
  };

  const handleSave = () => {
    localStorage.setItem('save_caro5', JSON.stringify({ board, timeLeft, winner }));
    alert('Đã lưu!');
  };

  const handleLoad = () => {
    const s = localStorage.getItem('save_caro5');
    if (s) {
      const d = JSON.parse(s);
      setBoard(d.board); setTimeLeft(d.timeLeft); setWinner(d.winner);
      alert('Đã tải!');
    }
  };

  return (
    <div className="board-wrapper" style={{ maxWidth: '700px' }}>
      <h2 style={{ color: '#ff4757' }}>Caro Hàng 5</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <span>{winner ? `Thắng: ${winner}` : `Thời gian: ${timeLeft}s`}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 35px)`, gap: '1px', backgroundColor: 'var(--border-color)', padding: '5px' }}>
        {board.map((cell, i) => (
          <div key={i} onClick={() => handleCellClick(i)} style={{ width: '35px', height: '35px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: cell === 'X' ? '#0984e3' : '#ff4757', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>{cell}</div>
        ))}
      </div>
      <div className="controls-group">
        <button className="control-btn" onClick={onBack}>BACK</button>
        <button className="control-btn" onClick={() => { setBoard(Array(SIZE*SIZE).fill(null)); setWinner(null); setTimeLeft(600); }}>CHƠI LẠI</button>
        <button className="control-btn" onClick={handleSave}>LƯU</button>
        <button className="control-btn" onClick={handleLoad}>TẢI</button>
      </div>
    </div>
  );
};

export default Caro5x5;