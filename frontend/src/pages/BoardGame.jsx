import { useState } from 'react';
import axios from 'axios';
import Caro5x5 from '../games/Caro5x5';
import Caro4x4 from '../games/Caro4x4';
import TicTacToe from '../games/TicTacToe';
import Snake from '../games/Snake';
import CandyCrush from '../games/CandyCrush';
import Memory from '../games/Memory';
import DrawBoard from '../games/DrawBoard';

const GAMES_LIST = [
  { id: 1, name: 'Caro Hàng 5', color: '#ff4757', code: 'caro5', comp: Caro5x5 },
  { id: 2, name: 'Caro Hàng 4', color: '#ffa502', code: 'caro4', comp: Caro4x4 },
  { id: 3, name: 'Tic-Tac-Toe', color: '#2ed573', code: 'tictactoe', comp: TicTacToe },
  { id: 4, name: 'Rắn Săn Mồi', color: '#1e90ff', code: 'snake', comp: Snake },
  { id: 5, name: 'Ghép Hàng 3', color: '#9c88ff', code: 'candy', comp: CandyCrush },
  { id: 6, name: 'Cờ Trí Nhớ', color: '#ff6b81', code: 'memory', comp: Memory },
  { id: 7, name: 'Bảng Vẽ', color: '#eccc68', code: 'draw', comp: DrawBoard },
];

const BoardGame = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const handleMenuControl = (action) => {
    if (action === 'LEFT') setCursor((prev) => (prev > 0 ? prev - 1 : GAMES_LIST.length - 1));
    else if (action === 'RIGHT') setCursor((prev) => (prev < GAMES_LIST.length - 1 ? prev + 1 : 0));
    else if (action === 'ENTER') setSelectedGame(GAMES_LIST[cursor]);
    else if (action === 'HINT') alert(`Chọn game bằng Left/Right, nhấn ENTER để vào chơi.`);
  };

  const submitRating = async (stars) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Vui lòng đăng nhập để đánh giá!');
      await axios.post('http://localhost:5000/api/users/rating', 
        { game_code: selectedGame.code, stars, comment: ratingComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cảm ơn bạn đã đánh giá!');
      setRatingComment('');
    } catch (e) {
      alert('Lỗi khi gửi đánh giá.');
    }
  };

  if (selectedGame) {
    const GameComponent = selectedGame.comp;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <GameComponent onBack={() => setSelectedGame(null)} />
        
        <div className="board-wrapper" style={{ marginTop: '20px', width: '100%', maxWidth: '600px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Đánh Giá Trò Chơi</h3>
          <input 
            type="text" 
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Để lại bình luận của bạn..." 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '15px', boxSizing: 'border-box' }} 
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => submitRating(star)} 
                className="control-btn"
                style={{ padding: '8px 15px', backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none' }}
              >
                {star} SAO
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-wrapper">
      <h2 style={{ marginBottom: '5px' }}>Chọn Trò Chơi</h2>
      <h3 style={{ color: GAMES_LIST[cursor].color, height: '30px', marginTop: '0' }}>{GAMES_LIST[cursor].name}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 45px)', gap: '8px', backgroundColor: 'var(--matrix-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {GAMES_LIST.map((game, index) => (
          <div key={index} style={{ backgroundColor: game.color, width: '45px', height: '45px', borderRadius: '50%', border: cursor === index ? '4px solid var(--text-primary)' : '4px solid transparent', boxSizing: 'border-box', opacity: cursor === index ? 1 : 0.6, transform: cursor === index ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <div className="controls-group">
        <button className="control-btn" onClick={() => handleMenuControl('LEFT')}>LEFT</button>
        <button className="control-btn" onClick={() => handleMenuControl('RIGHT')}>RIGHT</button>
        <button className="control-btn" onClick={() => handleMenuControl('ENTER')}>ENTER</button>
        <button className="control-btn" disabled>BACK</button>
        <button className="control-btn" onClick={() => handleMenuControl('HINT')}>HINT</button>
      </div>
    </div>
  );
};

export default BoardGame;