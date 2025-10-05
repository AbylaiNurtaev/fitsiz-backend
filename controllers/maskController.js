
const prisma = require('../prisma');
exports.getMask = async (req, res) => {
  try {
    const { id } = req.params;
    const mask = await prisma.mask.findUnique({
      where: { id: parseInt(id) },
      include: { features: true, reviews: true, ExtraField: true },
    });
    if (!mask) {
      return res.status(404).json({ error: "Mask not found" });
    }
    res.json(mask);
  } catch (error) {
    console.error("Get mask error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.getMasks = async (req, res) => {
  try {
    const masks = await prisma.mask.findMany({
      include: {
        features: true,
        reviews: true,
        ExtraField: true,
      },
    });
    res.json(masks);
  } catch (error) {
    console.error('Get masks error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getMaskInstructions = async (req, res) => {
  try {
    const { id } = req.params;
    const mask = await prisma.mask.findUnique({
      where: { id: parseInt(id) },
      select: { instructions: true },
    });
    if (!mask) {
      return res.status(404).json({ error: 'Mask not found' });
    }
    res.json({ instructions: mask.instructions });
  } catch (error) {
    console.error('Get mask instructions error:', error.message);
    res.status(500).json({ error: error.message });
  }
};