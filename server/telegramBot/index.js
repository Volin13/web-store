// require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const { TELEGRAM_BOT_TOKEN } = process.env;

const startBot = () => {
  const webApp = 'https://www.google.com/';
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  bot.on('message', async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    await bot.sendMessage(
      chatId,
      'Вибачте бот ще на стадії розробики, спробуйте пізніше',
    );

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Заповніть форму, після кліку на кнопку', {
        reply_markup: {
          keyboard: [[{ text: 'Заповнити форму', web_app: { url: webApp } }]],
        },
      });

      await bot.sendMessage(
        chatId,
        'Заходьте на сайт нашого інтернет магазину',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Зробити замовлення', web_app: { url: webApp } }],
            ],
          },
        },
      );
    }
  });

  console.log('Telegram bot started');
};

module.exports = startBot;
