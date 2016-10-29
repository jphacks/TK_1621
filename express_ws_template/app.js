const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');

// To prevent server crash when occuring uncaughtException.
process.on('uncaughtException', (err) => {
  console.log(err);
});

const app = express();
const errorHandler = (err, req, res, next) => {
  res.status(500).send({ error: 'unexpected errors occured.' });
  console.log('Do not use next() here', next);
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
router(app);
app.use(errorHandler);

const server = app.listen(3000);
module.exports = server;
