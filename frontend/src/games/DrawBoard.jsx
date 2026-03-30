import { useState } from 'react';

const SIZE = 15;

const DrawBoard = ({ onBack }) => {
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill('var(--bg-secondary)'));

  const handleCellClick = (i) => {
    let nB = [...board];
    nB[i] = nB[i] === 'var(--bg-secondary)' ? '#eccc68' : 'var(--bg-secondary)';
    setBoard(nB);
  };

  const handleSave = () => { localStorage.setItem('save_draw', JSON.stringify({ board })); alert('Đã lưu tác phẩm!'); };
  const handleLoad = () => {
    const s = localStorage.getItem('save_draw');
    if (s) { setBoard(JSON.parse(s).board); alert('Đã tải tác phẩm!'); }
  };

  return (
    <div className="board-wrapper" style={{ width: '100%', maxWidth: '600px' }}>
      <h2 style={{ color: '#eccc68', margin: '0 0 15px 0' }}>Bảng Vẽ Tự Do</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 30px)`, gap: '2px', backgroundColor: 'var(--border-color)', padding: '10px', borderRadius: '8px' }}>
        {board.map((color, i) => (
          <div key={i} onClick={() => handleCellClick(i)} style={{ width: '30px', height: '30px', backgroundColor: color, cursor: 'pointer', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
        ))}
      </div>
      <div className="controls-group" style={{ marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="control-btn" onClick={onBack}>⬅ QUAY LẠI MENU</button>
        <button className="control-btn" onClick={() => setBoard(Array(SIZE * SIZE).fill('var(--bg-secondary)'))}>XÓA TRẮNG BẢNG</button>
        <button className="control-btn" onClick={handleSave} style={{ backgroundColor: '#00b894', color: '#fff' }}>💾 LƯU TRANH</button>
        <button className="control-btn" onClick={handleLoad} style={{ backgroundColor: '#fdcb6e', color: '#000' }}>📂 TẢI TRANH</button>
      </div>
    </div>
  );
};

export default DrawBoard;