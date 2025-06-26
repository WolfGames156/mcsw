const mineflayer = require('mineflayer');

const options = {
  host: 'LiftcraftS2.aternos.me',
  port: 58308,
  username: 'Bot_' + Math.floor(Math.random() * 10000),
  version: false, // otomatik versiyon
};

let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.on('login', () => {
    console.log('[+] Giriş yapıldı!');
    bot.chat('/register 123456 123456');
    setTimeout(() => {
      bot.chat('/login 123456');
    }, 2000);
  });

  bot.on('spawn', () => {
    console.log('[+] Bot sunucuda!');

    function randomMove() {
      const movements = ['forward', 'back', 'left', 'right'];
      const move = movements[Math.floor(Math.random() * movements.length)];
      bot.setControlState(move, true);
      setTimeout(() => {
        bot.setControlState(move, false);
      }, 1000);
    }

    setInterval(randomMove, 5000);
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }, 8000);
  });

  bot.on('end', () => {
    console.log('[!] Bağlantı kesildi. Yeniden bağlanılıyor...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    console.log('[!] Hata oluştu: ', err.message);
  });
}

createBot();
