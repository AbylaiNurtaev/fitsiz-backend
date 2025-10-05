const { getUser } = require('../services/userService');

exports.getUser = async (req, res) => {
  try {
    const user = await getUser(req.params.telegramId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};