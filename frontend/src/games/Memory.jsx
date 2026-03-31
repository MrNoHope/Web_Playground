import { useState, useEffect } from 'react';
import axios from 'axios';

const colors = ['#ff4757','#ff4757','#ffa502','#ffa502','#2ed573','#2ed573','#1e90ff','#1e90ff','#9c88ff','#9c88ff','#eccc68','#eccc68','#000','#000','#555','#555'];
const shuffle = (a) => a.sort(() => Math.random() - 0.5);

const Memory = ({ onBack }) => {
  const [cards, setCards] = useState(() => shuffle([...colors]));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (matched.length === 16 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [matched, timeLeft]);

  useEffect(() => {
    if (matched.length === 16) {
      const finalScore = timeLeft * 10;
      const token = localStorage.getItem('token');
      if (token) {
        axios.post('http://localhost:5000/api/users/score', 
          { game_code: 'memory', score: finalScore }, 
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(e => console.log(e));
      }
    }
  }, [matched, timeLeft]);

  useEffect(() => {
    if (flipped.length === 2) {
      if (cards[flipped[0]] === cards[flipped[1]]) { setMatched(p => [...p, ...flipped]); setFlipped([]); }
      else { setTimeout(() => setFlipped([]), 800); }
    }
  }, [flipped, cards]);

  const handleCellClick = (i) => { if (timeLeft <= 0 || flipped.length >= 2 || flipped.includes(i) || matched.includes(i)) return; setFlipped(p => [...p, i]); };
  
  const handleRestart = () => { setCards(shuffle([...colors])); setFlipped([]); setMatched([]); setTimeLeft(120); };
  const handleSave = () => { localStorage.setItem('save_mem', JSON.stringify({ cards, matched, timeLeft })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_mem');
    if (s) { const d = JSON.parse(s); setCards(d.cards); setMatched(d.matched); setTimeLeft(d.timeLeft); setFlipped([]); alert('Đã tải!'); }
  };

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '600px' }}>
      <h2 style={{ color: '#ff6b81', margin: '0 0 10px 0' }}>Cờ Trí Nhớ</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>{matched.length === 16 ? 'Chiến thắng!' : timeLeft <= 0 ? 'Hết giờ!' : `Đã mở: ${matched.length / 2}/8`}</div>
        <div style={{ fontWeight: 'bold' }}>Thời gian: {timeLeft}s</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 90px)', gap: '8px', backgroundColor: 'var(--border-color)', padding: '15px', borderRadius: '8px' }}>
        {cards.map((color, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return <div key={i} onClick={() => handleCellClick(i)} style={{ width: '90px', height: '90px', backgroundColor: isFlipped ? color : 'var(--bg-primary)', borderRadius: '10px', cursor: 'pointer', border: '2px solid var(--border-color)', transition: 'all 0.3s' }} />
        })}
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

export default Memory;