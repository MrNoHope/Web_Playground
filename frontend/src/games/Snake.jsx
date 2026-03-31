import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SIZE = 12;

const Snake = ({ onBack }) => {
  const [snake, setSnake] = useState([{ x: 6, y: 6 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 1, y: 0 }); 
  const [lose, setLose] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const getCellType = useCallback((x, y) => {
    if (food.x === x && food.y === y) return 'food';
    for (let part of snake) { if (part.x === x && part.y === y) return 'snake'; }
    return 'empty';
  }, [food, snake]);

  const changeDir = useCallback((x, y) => {
    if (lose) return;
    setDir(prevDir => {
      if (prevDir.x !== 0 && x !== 0) return prevDir;
      if (prevDir.y !== 0 && y !== 0) return prevDir;
      return { x, y };
    });
  }, [lose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp') changeDir(0, -1);
      if (e.key === 'ArrowDown') changeDir(0, 1);
      if (e.key === 'ArrowLeft') changeDir(-1, 0);
      if (e.key === 'ArrowRight') changeDir(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDir]);

  const saveFinalScore = async (finalScore) => {
    try {
      const token = localStorage.getItem('token');
      if (token && finalScore > 0) {
        await axios.post('http://localhost:5000/api/users/score', 
          { game_code: 'snake', score: finalScore }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (lose) return;
    const t = setInterval(() => setTime(s => s + 1), 1000);
    const move = setInterval(() => {
      setSnake(prev => {
        let nS = [...prev];
        let head = { ...nS[0] };
        head.x += dir.x; head.y += dir.y;

        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) { 
          setLose(true); 
          saveFinalScore(score);
          return prev; 
        }
        for (let part of nS) { 
          if (part.x === head.x && part.y === head.y) { 
            setLose(true); 
            saveFinalScore(score);
            return prev; 
          } 
        }

        nS.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood({ x: Math.floor(Math.random()*SIZE), y: Math.floor(Math.random()*SIZE) });
        } else { nS.pop(); }
        return nS;
      });
    }, 250);
    return () => { clearInterval(move); clearInterval(t); }
  }, [dir, lose, food, score]);

  const handleRestart = () => {
    setSnake([{ x: 6, y: 6 }]); setFood({ x: 3, y: 3 });
    setDir({ x: 1, y: 0 }); setLose(false); setScore(0); setTime(0);
  };

  const handleSave = () => { localStorage.setItem('save_snake', JSON.stringify({ snake, food, dir, score, time })); alert('Đã lưu!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_snake');
    if (s) { const d = JSON.parse(s); setSnake(d.snake); setFood(d.food); setDir(d.dir); setScore(d.score); setTime(d.time); setLose(false); alert('Đã tải!'); }
  };

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '500px' }}>
      <h2 style={{ color: '#1e90ff', margin: '0 0 10px 0' }}>Rắn Săn Mồi</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold' }}>Điểm: {score} {lose && '(THUA)'}</div>
        <div style={{ fontWeight: 'bold' }}>Sinh tồn: {time}s</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 35px)`, gap: '2px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {Array(SIZE*SIZE).fill(0).map((_, i) => {
          let x = i % SIZE, y = Math.floor(i / SIZE), t = getCellType(x, y);
          let c = 'var(--bg-secondary)';
          if (t === 'snake') c = '#2ed573';
          if (t === 'food') c = '#ff4757';
          return <div key={i} style={{ width: '35px', height: '35px', backgroundColor: c, borderRadius: '4px' }} />;
        })}
      </div>
      <div className="controls-group" style={{ marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="control-btn" onClick={onBack}>BACK</button>
        <button className="control-btn" onClick={handleRestart} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>CHƠI LẠI</button>
        <button className="control-btn" onClick={handleSave} style={{ backgroundColor: '#00b894', color: '#fff' }}>LƯU</button>
        <button className="control-btn" onClick={handleLoad} style={{ backgroundColor: '#fdcb6e', color: '#000' }}>TẢI</button>
      </div>
    </div>
  );
};

export default Snake;