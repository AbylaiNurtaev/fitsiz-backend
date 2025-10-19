const prisma = require("../prisma");

exports.registerUser = async (telegramId, firstName) => {
  try {
    // Используем безопасное выполнение с retry логикой
    const existingUser = await prisma.safeExecute(async () => {
      return await prisma.user.findUnique({
        where: { telegramId },
      });
    });

    if (existingUser) {
      return existingUser;
    }

    // Создание нового пользователя, если его нет
    return await prisma.safeExecute(async () => {
      return await prisma.user.create({
        data: { telegramId, firstName },
      });
    });
  } catch (error) {
    console.error('AuthService error:', error.message);
    throw error;
  }
};