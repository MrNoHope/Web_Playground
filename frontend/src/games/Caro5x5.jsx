import { useState, useEffect } from 'react';

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

  const botMove = (cB) => {
    let e = cB.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (e.length === 0) return cB;
    let newB = [...cB];
    newB[e[Math.floor(Math.random() * e.length)]] = 'O';
    return newB;
  };

  const handleCellClick = (index) => {
    if (winner || timeLeft <= 0 || board[index] !== null) return;
    let newB = [...board];
    newB[index] = 'X';
    newB = botMove(newB);
    setBoard(newB);
  };

  const handleRestart = () => { setBoard(Array(SIZE * SIZE).fill(null)); setWinner(null); setTimeLeft(600); };
  const handleSave = () => { localStorage.setItem('save_caro5', JSON.stringify({ board, timeLeft, winner })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_caro5');
    if (s) { const d = JSON.parse(s); setBoard(d.board); setTimeLeft(d.timeLeft); setWinner(d.winner); alert('Đã tải!'); }
  };
  const formatTime = (s) => `${Math.floor(s / 60)}:${('0' + (s % 60)).slice(-2)}`;

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '700px' }}>
      <h2 style={{ color: '#ff4757', margin: '0 0 10px 0' }}>Caro Hàng 5</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>{winner ? `Kết quả: ${winner}` : timeLeft <= 0 ? 'Hết giờ!' : 'Tới lượt bạn (X)'}</div>
        <div style={{ fontWeight: 'bold', color: timeLeft < 60 ? '#ff4757' : 'inherit' }}>Thời gian: {formatTime(timeLeft)}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 35px)`, gap: '2px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {board.map((cell, index) => (
          <div key={index} onClick={() => handleCellClick(index)} style={{ width: '35px', height: '35px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '24px', color: cell === 'X' ? '#0984e3' : '#ff4757', border: '1px solid var(--border-color)', cursor: 'pointer', boxSizing: 'border-box' }}>
            {cell}
          </div>
        ))}
      </div>
      <div className="controls-group" style={{ marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="control-btn" onClick={onBack}>⬅ MENU</button>
        <button className="control-btn" onClick={handleRestart} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>🔄 CHƠI LẠI</button>
        <button className="control-btn" onClick={handleSave} style={{ backgroundColor: '#00b894', color: '#fff' }}>💾 LƯU</button>
        <button className="control-btn" onClick={handleLoad} style={{ backgroundColor: '#fdcb6e', color: '#000' }}>📂 TẢI</button>
      </div>
    </div>
  );
};

export default Caro5x5;