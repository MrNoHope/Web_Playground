const knex = require('knex')(require('../../knexfile').development);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kiểm tra trùng tên
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });

    // Băm mật khẩu
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

    // Trùng khớp mật khẩu
    let isValidPassword = false;
    if (user.password === '123') isValidPassword = (password === '123'); // Dành cho seed data
    else isValidPassword = await bcrypt.compare(password, user.password); // Dành cho user tạo mới

    if (!isValidPassword) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu' });

    // Tạo vé thông hành (Token)
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'chuot_phim_bi_mat', { expiresIn: '24h' });

    res.status(200).json({ message: 'Đăng nhập thành công', token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { register, login };