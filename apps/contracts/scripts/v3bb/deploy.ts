import { deployContract } from '../util';
import { getContractAddresses } from './contract';
import fs from 'fs';

async function main() {
  const contracts = await getContractAddresses();

  const lender = await deployContract('Lender', [contracts.want, contracts.market], true);

  const deployed = {
    lender: lender.address,
  };

  // save to local file
  await fs.writeFileSync(
    `./scripts/v3bb/deployed.json`,
    JSON.stringify(deployed, null, 2),
  );

  process.exit(0);
}

main();
