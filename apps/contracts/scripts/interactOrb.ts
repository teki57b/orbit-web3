import { ethers } from 'hardhat';

async function main() {
  const [signer] = await ethers.getSigners();
  const orbVault = await ethers.getContractAt('OrbVault', '0xbCF26943C0197d2eE0E5D05c716Be60cc2761508', signer);
  const txDeposit = await orbVault.deposit(ethers.utils.parseEther('2'), { value: ethers.utils.parseEther('2') });
  await txDeposit.wait();
  const txWithdraw = await orbVault.withdraw(ethers.utils.parseEther('1'));
  await txWithdraw.wait();
  console.log(`total supply: ${await orbVault.totalSupply()}`);
  console.log(`total asset: ${await orbVault.totalAsset()}`);

  process.exit(0);
}

main();
