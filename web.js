const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Minecraft bot aktif!');
});

app.listen(port, () => {
  console.log(`Web sunucu aktif: http://localhost:${port}`);
});
