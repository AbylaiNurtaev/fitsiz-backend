const prisma = require("../prisma");

exports.registerUser = async (telegramId, firstName) => {
  // Проверка существования пользователя
  const existingUser = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (existingUser) {
    return existingUser;
  }

  // Создание нового пользователя, если его нет
  return await prisma.user.create({
    data: { telegramId, firstName },
  });
};