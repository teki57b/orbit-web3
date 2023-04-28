import { ethers } from 'hardhat';
import { deployContract } from '../util';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  const orbToken = await deployContract('ERC20Token', ['OrbToken', 'ORB'], true);
  const orbVault = await deployContract('OrbVault', [orbToken.address], true);
  console.log(`OrbToken address: ${orbToken.address}`);
  console.log(`OrbVault address: ${orbVault.address}`);
  process.exit(0);
}

main();