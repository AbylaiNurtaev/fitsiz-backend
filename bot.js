const TelegramBot = require('node-telegram-bot-api');
const prisma = require('./prisma');

const globalForBot = globalThis;

if (!globalForBot.telegramBotInstance) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN не задан — бот не будет запущен');
  } else {
    const bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, async (msg) => {
      const userId = String(msg.from.id);
      const firstName = msg.from.first_name || 'Без имени';

      try {
        await prisma.user.upsert({
          where: { telegramId: userId },
          update: {
            isBotAvailable: true,
            firstName,
          },
          create: {
            telegramId: userId,
            firstName,
            isBotAvailable: true,
          },
        });

        await bot.sendMessage(msg.chat.id, '👋 Привет! Вы подписались на уведомления.');
        console.log(`User ${userId} подписался`);
      } catch (err) {
        console.error('Ошибка при сохранении Telegram-пользователя:', err.message);
      }
    });

    globalForBot.telegramBotInstance = bot;
  }
}

module.exports = globalForBot.telegramBotInstance;

