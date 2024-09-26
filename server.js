const express = require('express');
const next = require('next');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // Import and use your Telegram bot logic here
  require('./server');

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = createServer(server);
  const port = process.env.PORT || 3000;

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
