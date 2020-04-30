const express = require('express');
const app = express();
const http = require('http');
const path = require("path");
const WebSocket = require('ws');

const chokidar = require('chokidar');
const watcher = chokidar.watch(process.cwd(), { ignored: /node_modules/ });
const sockets = new Set();
watcher.on('change', (file) => {
  sockets.forEach(socket => {
    socket.send(JSON.stringify({ type: 'changed' }));
  })
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', socket => {
  sockets.add(socket);

  socket.send(JSON.stringify({ type: 'connected' }))

  socket.on('close', () => {
    sockets.delete(socket);
  })
});

app.use(express.static(path.resolve(__dirname)));
server.listen('3000', () => {
  console.log('Server listening on 3000');
})
