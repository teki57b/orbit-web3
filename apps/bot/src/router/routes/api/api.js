const router = require('koa-router')()
const readBalance = require('./controller/readBalance');

router.get('/getBalance', readBalance);

module.exports = router
