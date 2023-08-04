import { ethers } from 'hardhat';
import { getContractAddresses } from './address';

async function main() {
  const contracts = await getContractAddresses();
  const [signer] = await ethers.getSigners();

  const market = await ethers.getContractAt('Market', contracts.market, signer);

  const txAccrue = await market.accrueInterest();
  await txAccrue.wait();

  process.exit(0);
}

main();