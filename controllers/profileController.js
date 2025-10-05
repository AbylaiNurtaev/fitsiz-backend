
const prisma = require('../prisma');
const { sendMessage } = require('../services/telegramService');
const { getSetting } = require('../services/settingsService');
exports.updateProfile = async (req, res) => {
  try {
    const { telegramId, firstName, phone, email, maskId, quiz, add } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId is required' });
    }

    let mask = null;
    if (maskId !== undefined && maskId !== null && maskId !== '') {
      const parsedMaskId = parseInt(maskId);
      if (isNaN(parsedMaskId)) {
        return res.status(400).json({ error: 'Invalid maskId' });
      }

      mask = await prisma.mask.findUnique({ where: { id: parsedMaskId } });
      if (!mask) {
        return res.status(400).json({ error: 'Mask with provided maskId does not exist' });
      }
    }

    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        firstName: firstName || undefined,
        phone: phone || null,
        email: email || null,
        isBotAvailable: true,
        quiz: typeof quiz === 'boolean' ? quiz : undefined,
      },
      create: {
        telegramId,
        firstName: firstName || 'Unknown',
        phone: phone || null,
        email: email || null,
        quiz: typeof quiz === 'boolean' ? quiz : false,
        isBotAvailable: true,
      },
    });

    if (mask && add === true) {
      const existing = await prisma.userMask.findUnique({
        where: {
          userId_maskId: {
            userId: user.id,
            maskId: mask.id,
          },
        },
      });

      if (!existing) {
        await prisma.userMask.create({
          data: {
            user: { connect: { id: user.id } },
            mask: { connect: { id: mask.id } },
          },
        });
      }

      const msg = await getSetting('TG_MESSAGE_ON_ADD_MASK');
      if (msg) {
        await sendMessage(user.telegramId, msg);
      } else {
        console.warn('TG_MESSAGE_ON_ADD_MASK not set in settings');
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
