const { authenticateAdmin } = require('../config/auth');

// POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const authResult = authenticateAdmin(email, password);
    if (!authResult) {
      return res.status(401).json({ error: 'Invalid admin email or password' });
    }

    res.json({
      message: 'Admin authentication successful',
      token: authResult.token,
      admin: authResult.admin
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

// GET /api/admin/me
exports.getMe = async (req, res) => {
  res.json({
    admin: req.admin
  });
};

