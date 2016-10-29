const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/v1/ws-recordings');

ws.on('open', () => {
  ws.on('message', (data) => {
    console.log(data);
  });
  ws.send('テストやで!!!!!!');
});

ws.on('error', (error) => {
  console.log(error);
});
