import { useState, useEffect } from 'react';
import axios from 'axios';

const SIZE = 8;
const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#9c88ff', '#eccc68'];
const gen = () => Array(SIZE * SIZE).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)]);

const CandyCrush = ({ onBack }) => {
  const [board, setBoard] = useState(gen());
  const [select, setSelect] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isSaved && score > 0) {
        const token = localStorage.getItem('token');
        if (token) {
          axios.post('http://localhost:5000/api/users/score', 
            { game_code: 'candy', score: score }, 
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch(e => console.log(e));
        }
        setIsSaved(true);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSaved, score]);

  const handleCellClick = (i) => {
    if (timeLeft <= 0) return;
    if (select === null) { setSelect(i); } 
    else {
      if (i === select - 1 || i === select + 1 || i === select - SIZE || i === select + SIZE) {
        let nB = [...board]; [nB[select], nB[i]] = [nB[i], nB[select]];
        setBoard(nB); setScore(s => s + 5); setSelect(null);
      } else { setSelect(i === select ? null : i); }
    }
  };

  const handleRestart = () => { setBoard(gen()); setSelect(null); setScore(0); setTimeLeft(180); setIsSaved(false); };
  const handleSave = () => { localStorage.setItem('save_candy', JSON.stringify({ board, score, timeLeft })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_candy');
    if (s) { const d = JSON.parse(s); setBoard(d.board); setScore(d.score); setTimeLeft(d.timeLeft); setSelect(null); setIsSaved(false); alert('Đã tải!'); }
  };

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '600px' }}>
      <h2 style={{ color: '#9c88ff', margin: '0 0 10px 0' }}>Ghép Hàng 3</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>Điểm số: {score}</div>
        <div style={{ fontWeight: 'bold' }}>{timeLeft <= 0 ? 'Hết giờ!' : `Thời gian: ${timeLeft}s`}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 45px)`, gap: '4px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {board.map((color, i) => (
          <div key={i} onClick={() => handleCellClick(i)} style={{ width: '45px', height: '45px', backgroundColor: color, borderRadius: '8px', cursor: 'pointer', border: select === i ? '4px solid var(--text-primary)' : '4px solid transparent', boxSizing: 'border-box' }} />
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

export default CandyCrush;