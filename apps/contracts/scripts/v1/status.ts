import { ethers } from 'hardhat';
import { TOKEN_ADDRESS, VAULT_ADDRESS } from './address';

async function main() {
  const [signer] = await ethers.getSigners();
  const orbToken = await ethers.getContractAt('ERC20Token', TOKEN_ADDRESS, signer);
  const orbitVault = await ethers.getContractAt('OrbVault', VAULT_ADDRESS, signer);

  console.log(`user token balance: ${await orbToken.balanceOf(signer.address)}`);
  console.log(`user share balance: ${await orbitVault.balanceOf(signer.address)}`);
  console.log(`total assets: ${await orbitVault.totalAssets()}`);
  console.log(`total shares: ${await orbitVault.totalSupply()}`);

  process.exit(0);
}

main();