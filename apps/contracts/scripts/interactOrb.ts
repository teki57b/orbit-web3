import { ethers } from "hardhat";


async function main() {
const [signer] = await ethers.getSigners();
  const orbVault = await ethers.getContractAt("OrbVault", "0x0f5D1ef48f12b6f691401bfe88c2037c690a6afe", signer);
  const txDeposit = await orbVault.deposit(ethers.utils.parseEther('2'), {value: ethers.utils.parseEther('2')});
  await txDeposit.wait();
  const txWithdraw = await orbVault.withdraw(ethers.utils.parseEther('1'));
  await txWithdraw.wait();
  console.log(`total supply: ${await orbVault.totalSupply()}`);
  console.log(`total asset: ${await orbVault.totalAsset()}`);

  process.exit(0);
}

main();