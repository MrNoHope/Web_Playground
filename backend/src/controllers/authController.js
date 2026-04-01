const knex = require('knex')(require('../../knexfile').development);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await knex('users').insert({ username, password: hashedPassword, role: 'client' });
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex('users').where({ username }).first();
    if (!user) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    let isValidPassword = false;
    if (user.password === '123') isValidPassword = (password === '123'); 
    else isValidPassword = await bcrypt.compare(password, user.password); 

    if (!isValidPassword) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'chuot_phim_bi_mat', { expiresIn: '24h' });

    res.status(200).json({ message: 'Đăng nhập thành công', token, role: user.role });
  } catch (error) {
    console.error("=== LỖI ĐĂNG NHẬP CHI TIẾT ===", error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { register, login };