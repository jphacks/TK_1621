const express = require('express');

const app = express.Router();

// Create the stream.
// Listen for events.

app.ws('/', (ws) => {
  ws.on('message', () => {
    ws.send('ok!!!!!');
  });
});

module.exports = app;
