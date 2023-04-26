require('../config') // load config;
const Koa = require('koa');
const routers = require('../router/index');
const scheduledTasks = require('../cron/index');

const start = () => {
  const app = new Koa();
  scheduledTasks.forEach(task => task.start());

  app.use(routers.routes()).use(routers.allowedMethods())
  app.listen(process.env.ORBIT_BOT_PORT);
}

module.exports = start;
