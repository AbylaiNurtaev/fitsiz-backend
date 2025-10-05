const prisma = require("../prisma");

exports.updateProfile = async (telegramId, phone, email, maskId) => {
  return await prisma.user.update({
    where: { telegramId },
    data: { phone, email, maskId },
  });
};