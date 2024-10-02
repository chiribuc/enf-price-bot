const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = 'TELEGRAM_BOT_TOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Function to get the ENF token price from MEXC
async function getENFPrice() {
  try {
    const response = await fetch('https://api.mexc.com/api/v3/ticker/price?symbol=ENFUSDT', {
      timeout: 10000, // 10 seconds timeout
    });

    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.price) {
      return data.price;
    } else {
      console.error('Price field not found in the API response.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching ENF price:', error);
    return null;
  }
}

// Listen for '/price' command
bot.onText(/\/price/, async (msg) => {
  const chatId = msg.chat.id;

  const price = await getENFPrice();
  if (price) {
    const timestamp = new Date().toLocaleString();
    const formattedPrice = parseFloat(price).toFixed(6);
    const message = `💰 *ENF Price on MEXC*\n\nPrice: *$${formattedPrice}*\nTime: ${timestamp}`;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(
      chatId,
      '🚫 Could not fetch the price for ENF at this time. Please try again later.'
    );
  }
});

// Error handling for polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
