import { ethers } from 'hardhat';
import { getContractAddresses, getDeployedContracts } from './contract';
import fs from 'fs';

async function main() {
  const contracts = await getContractAddresses();
  const deployed = await getDeployedContracts();
  const [signer] = await ethers.getSigners();

  const want = await ethers.getContractAt('ERC20', contracts.want, signer);

  const lender = await ethers.getContractAt('Lender', deployed.lender, signer);

  const marketAbi = await JSON.parse(fs.readFileSync(`./scripts/v3bb/soUSDC_ABI.json`).toString());
  const market = await ethers.getContractAt(marketAbi, contracts.market, signer);

  await want.transfer(deployed.lender, 1_000_000);
  await lender.adjustPosition();

  const status = {
    userWantBalance: `${await want.balanceOf(signer.address)}`,
    lenderAccount: `${await market.getAccountSnapshot(deployed.lender)}`,
  }

  console.table(status);

  process.exit(0);
}

main();