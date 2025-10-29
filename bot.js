const TelegramBot = require('node-telegram-bot-api');
const prisma = require('./prisma');

const globalForBot = globalThis;

if (!globalForBot.telegramBotInstance) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN не задан — бот не будет запущен');
  } else {
    const startTelegramBot = async () => {
      // Опционально отключаем бот через переменную окружения
      if (process.env.TELEGRAM_BOT_DISABLE === 'true') {
        console.warn('TELEGRAM_BOT_DISABLE=true — бот не будет запущен');
        return;
      }

      // Пытаемся получить advisory lock в БД, чтобы не стартовать второй инстанс
      let lockAcquired = true;
      try {
        const result = await prisma.$queryRaw`SELECT pg_try_advisory_lock(664953210)`;
        // В Supabase/PG результат — массив с объектом { pg_try_advisory_lock: boolean }
        const flag = Array.isArray(result)
          ? Boolean(result[0]?.pg_try_advisory_lock)
          : Boolean(result?.pg_try_advisory_lock);
        lockAcquired = flag;
      } catch (e) {
        console.warn('Не удалось проверить advisory lock, продолжаем без блокировки:', e.message);
      }

      if (!lockAcquired) {
        console.warn('Другой инстанс бота уже активен (advisory lock). Бот не будет запущен.');
        return;
      }

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

      // Освобождение advisory lock при завершении
      const release = async () => {
        try {
          await prisma.$queryRaw`SELECT pg_advisory_unlock(664953210)`;
        } catch (_) {}
      };
      process.on('SIGTERM', release);
      process.on('SIGINT', release);
    };

    startTelegramBot().catch((error) => {
      console.error('Failed to initialize Telegram bot:', error.message);
    });
  }
}

module.exports = globalForBot.telegramBotInstance;

