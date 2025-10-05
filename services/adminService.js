const prisma = require("../prisma");


exports.createMask = async (name, instructions) => {
  return await prisma.mask.create({
    data: { name, instructions },
  });
};

exports.deleteUser = async (telegramId) => {
  return await prisma.user.delete({
    where: { telegramId },
  });
};