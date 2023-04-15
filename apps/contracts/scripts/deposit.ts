import { ethers } from 'hardhat';

async function main() {
  const [signer] = await ethers.getSigners();
  const orbVault = await ethers.getContractAt('OrbVault', '0x381445710b5e73d34aF196c53A3D5cDa58EDBf7A', signer);
  const txDeposit = await orbVault.deposit(ethers.utils.parseEther('2'), { value: ethers.utils.parseEther('2') });
  await txDeposit.wait();
  console.log(`total supply: ${await orbVault.totalSupply()}`);
  console.log(`total asset: ${await orbVault.totalAsset()}`);

  process.exit(0);
}

main();
