import { ethers } from 'hardhat';
import { deployContract } from '../util';
import { ContractAddresses } from './address';
import fs from 'fs';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // 1. deploy WantToken contract
  const wantToken = await deployContract('ERC20Token', ['Want', 'WNT'], true);
  console.log(`Want token address: ${wantToken.address}`);

  // 2. deploy OrbVault contract
  const orbVault = await deployContract('OrbVault', [wantToken.address], true);
  console.log(`Vault address: ${orbVault.address}`);

  // 4. deploy Market contract
  const market = await deployContract('Market', [wantToken.address], true);
  console.log(`Market address: ${market.address}`);
  wantToken.transfer(market.address, ethers.utils.parseEther('1000000'));

  // 5. deploy Strategy contract
  const strategy = await deployContract('Strategy', [orbVault.address, market.address], true);
  console.log(`Strategy address: ${strategy.address}`);

  // 6. add strategy to vault
  await orbVault.addStrategy(strategy.address);

  const addresses: ContractAddresses = {
    want: wantToken.address,
    vault: orbVault.address,
    market: market.address,
    strategy: strategy.address,
  };

  // save to local file
  await fs.writeFileSync(
    `./scripts/v2/contracts.json`,
    JSON.stringify(addresses, null, 2),
  );

  process.exit(0);
}

main();
