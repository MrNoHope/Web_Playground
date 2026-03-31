import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        if (response.data.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Lỗi hệ thống!');
    }
  };

  return (
    <div className="board-wrapper" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>{isLogin ? 'Trang Đăng Nhập' : 'Tạo Tài Khoản Mới'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} 
        />
        <button type="submit" className="control-btn" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none', padding: '12px' }}>
          {isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ TÀI KHOẢN'}
        </button>
      </form>
      <p style={{ color: '#ff4757', fontWeight: 'bold', minHeight: '20px', marginTop: '15px', textAlign: 'center' }}>{message}</p>
      <button 
        onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}
      >
        {isLogin ? 'Chưa có tài khoản? Bấm vào đây để Đăng ký' : 'Đã có tài khoản? Bấm vào đây để Đăng nhập'}
      </button>
    </div>
  );
};

export default Login;