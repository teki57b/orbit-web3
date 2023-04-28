import { ethers } from 'hardhat';
import { TOKEN_ADDRESS, VAULT_ADDRESS } from './address';

async function main() {
  const [signer] = await ethers.getSigners();
  const orbToken = await ethers.getContractAt('ERC20Token', TOKEN_ADDRESS, signer);
  const orbVault = await ethers.getContractAt('OrbVault', VAULT_ADDRESS, signer);
 
  await orbToken.increaseAllowance(VAULT_ADDRESS, ethers.utils.parseEther('200'));

  const txDeposit = await orbVault.deposit(ethers.utils.parseEther('100'));
  await txDeposit.wait();

  process.exit(0);
}

main();
