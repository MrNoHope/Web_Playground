const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    res.status(201).json({ message: 'API Đăng ký hoạt động', user: username });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    res.status(200).json({ message: 'API Đăng nhập hoạt động', token: 'fake-jwt-token' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = {
  register,
  login
};