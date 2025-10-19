const TelegramBot = require('node-telegram-bot-api');
const prisma = require('./prisma');

const globalForBot = globalThis;

if (!globalForBot.telegramBotInstance) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN не задан — бот не будет запущен');
  } else {
    try {
      const bot = new TelegramBot(token, { 
        polling: {
          interval: 300,
          autoStart: true,
          params: {
            timeout: 10
          }
        }
      });

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

      // Обработка ошибок polling
      bot.on('polling_error', (error) => {
        console.error('Polling error:', error.message);
        if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
          console.log('Bot instance conflict detected. Stopping polling...');
          bot.stopPolling();
        }
      });

      bot.on('error', (error) => {
        console.error('Bot error:', error.message);
      });

      globalForBot.telegramBotInstance = bot;
      console.log('✅ Telegram bot initialized');
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error.message);
    }
  }
}

module.exports = globalForBot.telegramBotInstance;

