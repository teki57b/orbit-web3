import { ethers } from 'hardhat';
import { getContractAddresses } from './address';

async function main() {
  const contracts = await getContractAddresses();
  const [signer] = await ethers.getSigners();
  const want = await ethers.getContractAt('ERC20Token', contracts.want, signer);
  const vault = await ethers.getContractAt('OrbVault', contracts.vault, signer);
  const strategy = await ethers.getContractAt('Strategy', contracts.strategy, signer);

  const status = {
    userTokenBalance: `${await want.balanceOf(signer.address)}`,
    userShareBalance: `${await vault.balanceOf(signer.address)}`,
    vaultTotalAssets: `${await vault.totalAssets()}`,
    vaultTotalShares: `${await vault.totalSupply()}`,
    strategyTotalAssets: `${await strategy.estimatedTotalAssets()}`,
    strategyLentAssets: `${await strategy.lentTotalAssets()}`,
  }

  console.table(status);

  process.exit(0);
}

main();