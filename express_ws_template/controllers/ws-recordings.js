const express = require('express');
const expressWs = require('express-ws');

const app = express.Router();
expressWs(app);

// Create the stream.
// Listen for events.

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    console.log(msg);
    ws.send('やっほーーー!!!!!');
  });
});

module.exports = app;
