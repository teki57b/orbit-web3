const router = require('koa-router')();
const api = require('./routes/api/api');

router.use('/api', api.routes(), api.allowedMethods())

module.exports = router
