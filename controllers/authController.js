const { registerUser } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { telegramId, firstName } = req.body;
    
    // Валидация обязательных полей
    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId is required' });
    }
    
    const user = await registerUser(telegramId, firstName);
    res.status(201).json(user);
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: error.message });
  }
};