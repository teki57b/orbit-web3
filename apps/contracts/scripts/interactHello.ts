import { ethers } from "hardhat";


async function main() {
const [signer] = await ethers.getSigners();
  const helloWorld = await ethers.getContractAt("HelloWorld", "0x8464135c8F25Da09e49BC8782676a84730C318bC", signer);
  const tx = await helloWorld.setGreeting("New Greeting");
  await tx.wait();
  const greeting = await helloWorld.sayHello();

  console.log(greeting);
  process.exit(0);
}

main();