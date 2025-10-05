const { registerUser } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { telegramId, firstName } = req.body;
    const user = await registerUser(telegramId, firstName);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};