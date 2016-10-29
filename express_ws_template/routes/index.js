const wsRecordings = require('../controllers/ws-recordings');

const routes = {
  wsRecordings,
};

module.exports = (app) => {
  app.use('/v1/ws-recordings', routes.wsRecordings);
};
