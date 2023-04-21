import { NextApiRequest, NextApiResponse } from 'next';
import { Vault } from './utils/utils';

const { CronJob } = require('cron');

const account = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
const cronPattern: string = '*/20 * * * * *'; // every 20 seconds
const myVault = new Vault(account);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(200)
    .json({ balance: await myVault.getBalance(), timestamp: new Date().toISOString() });
};

const myJob = new CronJob(cronPattern, async () => {
  console.log(await myVault.getBalance());
});

myJob.start();
