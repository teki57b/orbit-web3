import { ethers } from 'hardhat';
import { getContractAddresses } from './contract';
import fs from 'fs';

async function main() {
  const contracts = await getContractAddresses();
  const [signer] = await ethers.getSigners();

  const want = await ethers.getContractAt('ERC20', contracts.want, signer);

  const marketAbi = await JSON.parse(fs.readFileSync(`./scripts/v3bb/soUSDC_ABI.json`).toString());
  const market = await ethers.getContractAt(marketAbi, contracts.market, signer);

  const wantBefore = await want.balanceOf(signer.address);
  const ctokenBefore = await market.balanceOf(signer.address);

  await want.approve(market.address, 1_000_000); // $1
  await market.mint(100_000);

  const wantAfter = await want.balanceOf(signer.address);
  const ctokenAfter = await market.balanceOf(signer.address);

  const status = {
    wantBefore: `${wantBefore}`,
    wantAfter: `${wantAfter}`,
    ctokenBefore: `${ctokenBefore}`,
    ctokenAfter: `${ctokenAfter}`,
    exchangeRate: `${await market.exchangeRateStored()}`,
  }

  console.table(status);

  process.exit(0);
}

main();