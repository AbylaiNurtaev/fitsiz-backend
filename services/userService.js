const prisma = require("../prisma");

exports.getUser = async (telegramId) => {
  return await prisma.user.findUnique({
    where: { telegramId },
  });
};