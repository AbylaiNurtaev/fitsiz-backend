const axios = require('axios');
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

exports.sendMessage = async (chatId, text) => {
  if (!chatId || !text) {
    console.warn('Skipping message: invalid chatId or empty text');
    return;
  }

  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  } catch (err) {
    console.error('Error sending message to Telegram:', err.response?.data || err.message);
  }
};


exports.sendBroadcast = async (chatIds, text) => {
  for (const chatId of chatIds) {
    await exports.sendMessage(chatId, text);
  }
};
