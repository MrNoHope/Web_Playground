import { useState } from 'react';
import './BoardGame.css';

const BoardGame = () => {
  const totalCells = 100;
  const [cursor, setCursor] = useState(0);
  const [cells, setCells] = useState(Array(totalCells).fill('white'));

  const handleControl = (action) => {
    if (action === 'LEFT') {
      setCursor((prev) => (prev > 0 ? prev - 1 : totalCells - 1));
    } else if (action === 'RIGHT') {
      setCursor((prev) => (prev < totalCells - 1 ? prev + 1 : 0));
    } else if (action === 'ENTER') {
      const newCells = [...cells];
      newCells[cursor] = newCells[cursor] === 'white' ? '#1e90ff' : 'white';
      setCells(newCells);
    } else if (action === 'BACK') {
      setCells(Array(totalCells).fill('white'));
      setCursor(0);
    } else if (action === 'HINT') {
      alert('Gợi ý: Dùng Left/Right để di chuyển, Enter để chọn màu');
    }
  };

  return (
    <div className="board-container">
      <div className="matrix">
        {cells.map((color, index) => (
          <div
            key={index}
            className={`cell ${cursor === index ? 'active' : ''}`}
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>

      <div className="controls">
        <button onClick={() => handleControl('LEFT')}>Left</button>
        <button onClick={() => handleControl('RIGHT')}>Right</button>
        <button onClick={() => handleControl('ENTER')}>ENTER</button>
        <button onClick={() => handleControl('BACK')}>Back</button>
        <button onClick={() => handleControl('HINT')}>Hint/Help</button>
      </div>
    </div>
  );
};

export default BoardGame;