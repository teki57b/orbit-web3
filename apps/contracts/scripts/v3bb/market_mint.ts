import { ethers } from 'hardhat';
import { getContractAddresses } from './contract';
import fs from 'fs';
import { join } from 'path';

async function main() {
  const contracts = await getContractAddresses();
  // const [signer] = await ethers.getSigners();

  const signer = await ethers.getImpersonatedSigner("0xebe80f029b1c02862b9e8a70a7e5317c06f62cae");
  const want = await ethers.getContractAt('ERC20', contracts.want, signer);

  const marketAbi = await JSON.parse(fs.readFileSync(`./scripts/v3bb/soUSDC_ABI.json`).toString());
  const market = await ethers.getContractAt(marketAbi, contracts.market, signer);

  await want.approve(market.address, 100_000);
  await market.mint(100_000);

  const status = {
    userWantBalance: `${await want.balanceOf(signer.address)}`,
    userMarketBalance: `${await market.balanceOf(signer.address)}`,
    userLentAssets: `${await market.balanceOf(signer.address) * await market.exchangeRateStored() / 1e18}`,
    marketTotalSupply: `${await market.totalSupply()}`,
  }

  console.table(status);

  process.exit(0);
}

main();