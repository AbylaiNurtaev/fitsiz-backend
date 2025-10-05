const { getCatalog } = require('../services/catalogService');

exports.getCatalog = async (req, res) => {
  try {
    const { name } = req.query; // Фильтрация по имени
    const catalog = await getCatalog(name);
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};