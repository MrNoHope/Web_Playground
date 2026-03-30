import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      alert('Đăng nhập thành công! Đang vào hệ thống...');
      navigate('/'); 
    } catch (error) {
      setMessage(error.response?.data?.error || 'Lỗi kết nối tới Server!');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Trang Đăng Nhập</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '250px', gap: '10px' }}>
        <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Đăng nhập</button>
      </form>
      <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
};

export default Login;