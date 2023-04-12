import { ethers } from 'hardhat';
import { deployContract } from './util';

async function main() {
  const [deployer] = await ethers.getSigners();
  const helloWorld = await deployContract('HelloWorld', ['Teki Greeting'], true);
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`HelloWorld address:${helloWorld.address}`);
  process.exit(0);
}

main();