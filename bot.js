const mineflayer = require('mineflayer');


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Minecraft bot aktif ve çalışıyor!');
});

app.listen(port, () => {
  console.log(`[🌐] Web sunucu ${port} portunda çalışıyor.`);
});




const options = {
  host: 'LiftcraftS2.aternos.me',
  port: 58308,
  username: 'Bot_' + Math.floor(Math.random() * 10000),
  version: '1.16.5',// otomatik versiyon
};

let bot;
let moveInterval, jumpInterval;
let registerTimeout, loginTimeout;

function cleanup() {
  if (!bot) return;

  bot.removeAllListeners();

  if (moveInterval) {
    clearInterval(moveInterval);
    moveInterval = null;
  }
  if (jumpInterval) {
    clearInterval(jumpInterval);
    jumpInterval = null;
  }
  if (registerTimeout) {
    clearTimeout(registerTimeout);
    registerTimeout = null;
  }
  if (loginTimeout) {
    clearTimeout(loginTimeout);
    loginTimeout = null;
  }

  try {
    bot.quit(); // mineflayer >=4.3.0 için (yoksa hata vermez)
  } catch {}

  bot = null;
}

function createBot() {
  bot = mineflayer.createBot(options);

  bot.on('login', () => {
    console.log('[+] Giriş yapıldı!');
    // Bot hala bağlı mı kontrol edip komut gönderelim
    if (bot && bot.connected) {
      registerTimeout = setTimeout(() => {
        try {
          bot.chat('/register 123456 123456');
        } catch (e) {
          console.error('Register atılırken hata:', e.message);
        }
      }, 1000);

      loginTimeout = setTimeout(() => {
        try {
          bot.chat('/login 123456');
        } catch (e) {
          console.error('Login atılırken hata:', e.message);
        }
      }, 3000);
    }
  });

  bot.on('spawn', () => {
    console.log('[+] Bot sunucuda!');

    function randomMove() {
      const movements = ['forward', 'back', 'left', 'right'];
      const move = movements[Math.floor(Math.random() * movements.length)];
      if (bot && bot.connected) {
        bot.setControlState(move, true);
        setTimeout(() => {
          bot.setControlState(move, false);
        }, 1000);
      }
    }

    moveInterval = setInterval(randomMove, 5000);
    jumpInterval = setInterval(() => {
      if (bot && bot.connected) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 8000);
  });

  bot.on('end', () => {
    console.log('[!] Bağlantı kesildi. Sunucu kapalı olabilir. 1 dakika sonra yeniden bağlanacak...');
    cleanup();
    setTimeout(createBot, 60000);
  });

  bot.on('error', err => {
    console.log(`[!] Hata: ${err.message}. 1 dakika sonra tekrar denenecek...`);
    cleanup();
    setTimeout(createBot, 60000);
  });

  bot.on('error', err => {
  console.log(`[!] Hata: ${err.message}`);
  if (err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')) {
    console.log('[!] Sunucu kapalı veya bağlantı reddedildi. 1 dakika sonra yeniden denenecek...');
    cleanup();
    setTimeout(createBot, 60000);
  }
});


}




createBot();
