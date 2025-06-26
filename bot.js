
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');



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
  username: 'ByWolfGames',
  version: '1.16.5',
};

let bot;
let moveInterval, jumpInterval;
let registerTimeout, loginTimeout;
let retryCount = 0;
let sayac = 1;

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
    bot.quit();
  } catch {}

  bot = null;
}

function createBot() {
  bot = mineflayer.createBot(options);
  

  bot.on('login', () => {
  console.log('[+] Giriş yapıldı!');
  retryCount = 0;
});



  bot.on('spawn', () => {
  console.log('[+] Bot sunucuda!');
  bot.loadPlugin(pathfinder);


  // 4 saniye bekle, sonra /register at
  setTimeout(() => {
    try {
      bot.chat('/register 156mal 156mal');
      console.log('[🟢] /register komutu atıldı!');
    } catch (e) {
      console.error('Register atılırken hata:', e.message);
    }

    // 2 saniye bekle, sonra /login at
    setTimeout(() => {
      try {
        bot.chat('/login 156mal');
        console.log('[🟢] /login komutu atıldı!');
      } catch (e) {
        console.error('Login atılırken hata:', e.message);
      }

      // /login'den 2 saniye sonra hareket etmeye başla
      setTimeout(() => {
        startMovement(); // ← Hareket fonksiyonları burada başlıyor
      }, 4000);

    }, 2000);

  }, 4000);
});



function startMovement() {
  console.log('[🤖] Hareket başlatıldı (pathfinder ile).');
  let sayac = 1;
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);

  // Rastgele hedef üret
  function randomWalk() {
    const x = bot.entity.position.x + Math.floor(Math.random() * 10 - 5);
    const y = bot.entity.position.y;
    const z = bot.entity.position.z + Math.floor(Math.random() * 10 - 5);
    const goal = new goals.GoalBlock(x, y, z);

    console.log(`[🚶] Yürüme hedefi: (${x.toFixed(1)}, ${y}, ${z.toFixed(1)})`);
    bot.pathfinder.setGoal(goal);
  }
   jumpInterval = setInterval(() => {
    if (bot && bot.connected) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }
  }, 5000);

  function lookAround() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    if (bot && bot.look) {
      bot.look(yaw, pitch, true);
    }
  }
  

setInterval(() => {
  if (bot && bot.connected && bot.spawned) {
    try {
      bot.chat(`WolfGames Tarafından Yapıldım {${sayac}}`);
      console.log(`Chat mesajı gönderildi: WolfGames Tarafından Yapıldım {${sayac}}`);
      sayac++;
    } catch (err) {
      console.error('Chat gönderirken hata:', err);
    }
  }
}, 10000);

  setInterval(randomWalk, 8000);
    moveInterval = setInterval(() => {
    lookAround(); 
  }, 5000);


}
    bot.on('end', () => {
    console.log('[!] Bağlantı kesildi. Sunucu kapalı olabilir.');
    cleanup();
    if (retryCount === 0) {
      console.log('[!] 5 saniye sonra yeniden bağlanılıyor...');
      retryCount++;
      setTimeout(createBot, 2000);
    } else {
      console.log('[!] 1 dakika sonra yeniden bağlanılıyor...');
      retryCount = 0;
      setTimeout(createBot, 60000);
    }
  });
  bot.on('error', err => {
    console.log(`[!] Hata: ${err.message}`);
    cleanup();

    if (err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')) {
      if (retryCount === 0) {
        console.log('[!] Sunucu kapalı veya bağlantı reddedildi. 5 saniye sonra yeniden denenecek...');
        retryCount++;
        setTimeout(createBot, 3000);
      } else {
        console.log('[!] 1 dakika sonra yeniden denenecek...');
        retryCount = 0;
        setTimeout(createBot, 60000);
      }
    } else {
      // Diğer hatalarda da 1 dakika bekle
      setTimeout(createBot, 60000);
    }
  });



}


setInterval(() => {
  if (bot?.entity?.position) {
    console.log('[📍] Mevcut konum:', bot.entity.position);
  }
}, 10000);


createBot();
