const accRouter = require('./accRouter');
const siteRouter = require('./siteRouter');
const announceRouter = require('./announceRouter');

function route(app) {
 
  app.use('/acc',accRouter);
  app.use('/announce',announceRouter);
  app.use('/',siteRouter);
  
}
module.exports = route;