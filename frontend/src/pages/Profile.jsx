import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [myData, setMyData] = useState(null);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/users/profile-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyData(res.data.myInfo);
      setUsers(res.data.users);
      setFriends(res.data.friends);
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFriend = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/users/friend', { friend_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đã kết bạn thành công!');
      fetchData();
    } catch (error) {
      alert('Lỗi kết nối!');
    }
  };

  const handleSendMsg = async () => {
    if (!selectedUser) {
      alert('Vui lòng chọn một người bạn để gửi tin nhắn!');
      return;
    }
    if (!msgText.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/users/message', {
        receiver_id: selectedUser,
        content: msgText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsgText('');
      fetchData();
    } catch (error) {
      alert('Lỗi kết nối!');
    }
  };

  if (!token || !myData) {
    return <div className="board-wrapper"><h2 style={{ color: '#ff4757' }}>Vui lòng Đăng Nhập!</h2></div>;
  }

  const chatHistory = messages.filter(m =>
    (m.sender_id === myData.id && m.receiver_id === parseInt(selectedUser)) ||
    (m.sender_id === parseInt(selectedUser) && m.receiver_id === myData.id)
  );

  const friendIds = friends.map(f => f.id);
  const nonFriends = users.filter(u => !friendIds.includes(u.id));

  return (
    <div style={{ display: 'flex', gap: '20px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
      <div className="board-wrapper" style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ color: 'var(--accent-color)', margin: '0 0 15px 0' }}>Hồ Sơ Của Tôi</h2>
        <div style={{ padding: '15px', backgroundColor: 'var(--matrix-bg)', borderRadius: '8px', width: '100%' }}>
          <p>Tên tài khoản: <strong style={{ fontSize: '18px', color: '#0984e3' }}>{myData.username}</strong></p>
          <p>Quyền hạn: <strong style={{ textTransform: 'uppercase' }}>{myData.role}</strong></p>
          <p>Trạng thái: <strong style={{ color: '#00b894' }}>Đang hoạt động</strong></p>
        </div>

        <h3 style={{ marginTop: '30px', width: '100%', borderBottom: '2px solid var(--border-color)' }}>Bạn Bè Của Tôi</h3>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {friends.map(f => (
            <div key={f.id} style={{ padding: '10px', backgroundColor: 'var(--matrix-bg)', borderRadius: '6px', fontWeight: 'bold', color: '#00b894' }}>
              {f.username}
            </div>
          ))}
          {friends.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Chưa có bạn bè.</p>}
        </div>

        <h3 style={{ marginTop: '30px', width: '100%', borderBottom: '2px solid var(--border-color)' }}>Gợi Ý Kết Bạn</h3>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {nonFriends.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--matrix-bg)', borderRadius: '6px' }}>
              <span style={{ fontWeight: 'bold' }}>{u.username}</span>
              <button className="control-btn" style={{ padding: '6px 12px', minWidth: 'auto', fontSize: '14px' }} onClick={() => handleAddFriend(u.id)}>Kết Bạn</button>
            </div>
          ))}
          {nonFriends.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Không có gợi ý mới.</p>}
        </div>
      </div>

      <div className="board-wrapper" style={{ flex: '2', minWidth: '400px' }}>
        <h2 style={{ color: 'var(--accent-color)', margin: '0 0 15px 0' }}>Tin Nhắn Riêng Tư</h2>

        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: '15px', fontWeight: 'bold' }}>
          <option value="">-- Chọn bạn bè để nhắn tin --</option>
          {friends.map(f => <option key={f.id} value={f.id}>{f.username}</option>)}
        </select>

        <div style={{ height: '350px', overflowY: 'auto', backgroundColor: 'var(--matrix-bg)', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!selectedUser ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>Vui lòng chọn một người bạn để xem tin nhắn.</p>
          ) : chatHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>Chưa có cuộc trò chuyện. Hãy gửi lời chào!</p>
          ) : (
            chatHistory.map(m => {
              const isMe = m.sender_id === myData.id;
              return (
                <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', backgroundColor: isMe ? '#0984e3' : 'var(--bg-secondary)', color: isMe ? '#fff' : 'var(--text-primary)', padding: '10px 15px', borderRadius: '15px', maxWidth: '70%', border: isMe ? 'none' : '1px solid var(--border-color)' }}>
                  {!isMe && <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--accent-color)' }}>{m.sender_name}</div>}
                  {m.content}
                </div>
              );
            })
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
          <input type="text" value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Nhập tin nhắn..." style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onKeyPress={(e) => e.key === 'Enter' && handleSendMsg()} />
          <button className="control-btn" onClick={handleSendMsg} style={{ backgroundColor: '#00b894', color: '#fff', border: 'none', padding: '0 20px' }}>GỬI</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;