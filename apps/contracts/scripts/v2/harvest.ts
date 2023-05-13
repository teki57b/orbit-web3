import { ethers } from 'hardhat';
import { getContractAddresses } from './address';

async function main() {
  const contracts = await getContractAddresses();
  const [signer] = await ethers.getSigners();

  const strategy = await ethers.getContractAt('Strategy', contracts.strategy, signer);

  const txHarvest = await strategy.harvest();
  await txHarvest.wait();

  process.exit(0);
}

main();