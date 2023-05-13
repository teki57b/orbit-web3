import { ethers } from 'hardhat';
import { getContractAddresses } from './address';

async function main() {
  const [signer] = await ethers.getSigners();
  const contracts = await getContractAddresses();
  const want = await ethers.getContractAt('ERC20Token', contracts.want, signer);
  const vault = await ethers.getContractAt('OrbVault', contracts.vault, signer);
 
  await want.increaseAllowance(contracts.vault, ethers.utils.parseEther('200'));

  const txDeposit = await vault.deposit(ethers.utils.parseEther('10'));
  await txDeposit.wait();

  process.exit(0);
}

main();
