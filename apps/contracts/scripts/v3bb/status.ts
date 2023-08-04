import { ethers } from 'hardhat';
import { getContractAddresses } from './contract';
import fs from 'fs';

async function main() {
  const contracts = await getContractAddresses();

  const [signer] = await ethers.getSigners();
  const want = await ethers.getContractAt('ERC20', contracts.want, signer);

  const marketAbi = await JSON.parse(fs.readFileSync(`./scripts/v3bb/soUSDC_ABI.json`).toString());
  const market = await ethers.getContractAt(marketAbi, contracts.market, signer);

  // account snapshot
  const [ error, cTokenBalance, borrowBalance, exchangeRateMantissa ] = await market.getAccountSnapshot(signer.address);

  const status = {
    userWantBalance: `${await want.balanceOf(signer.address)}`,
    userMarketBalance: `${cTokenBalance}`,
    userLentAssets: `${cTokenBalance * exchangeRateMantissa / 1e18}`,
    userBorrowedAssets: `${borrowBalance}`,
  }

  console.table(status);

  process.exit(0);
}

main();