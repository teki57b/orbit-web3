import { ethers } from 'hardhat';
import { deployContract } from './util';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  const orbToken = await deployContract('OrbToken', [], true);
  const orbVault = await deployContract('OrbVault', [orbToken.address], true);
  await orbToken.transferOwnership(orbVault.address);
  console.log(`OrbToken address: ${orbToken.address}`);
  console.log(`OrbVault address: ${orbVault.address}`);

  process.exit(0);
}

main();