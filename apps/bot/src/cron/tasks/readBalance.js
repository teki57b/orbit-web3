const { vault } = require('../../services');
const { CronJob } = require('cron');

const cronPattern = '*/20 * * * * *'; // every 20 seconds
const myJob = new CronJob(cronPattern, async () => {
  console.log(await vault.getBalance());
});

module.exports = myJob;
