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
  await market.mint(500_000);

  const wantAfterMint = await want.balanceOf(signer.address);
  const ctokenAfterMint = await market.balanceOf(signer.address);

  await market.borrow(300_000);

  const wantAfterBorrow = await want.balanceOf(signer.address);
  const ctokenAfterBorrow = await market.balanceOf(signer.address);

  const status = {
    wantBefore: `${wantBefore}`,
    wantAfterMint: `${wantAfterMint}`,
    wantAfterBorrow: `${wantAfterBorrow}`,
    ctokenBefore: `${ctokenBefore}`,
    ctokenAfterMint: `${ctokenAfterMint}`,
    ctokenAfterBorrow: `${ctokenAfterBorrow}`,
  }

  console.table(status);

  process.exit(0);
}

main();