const { vault } = require('../../../../services')

const readBalance = async (ctx) => {
  const balance = await vault.getBalance();
  ctx.body = { balance, timestamp: new Date().toISOString() };
};

module.exports =  readBalance;
