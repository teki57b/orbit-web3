import { ethers } from 'hardhat';
import { getContractAddresses } from './contract';
import fs from 'fs';

async function main() {
  const contracts = await getContractAddresses();
  const signer = await ethers.getImpersonatedSigner("0xebe80f029b1c02862b9e8a70a7e5317c06f62cae");

  const compAbi = await JSON.parse(fs.readFileSync(`./scripts/v3bb/comptroller_ABI.json`).toString());
  const comp = await ethers.getContractAt(compAbi, contracts.comptroller, signer);

  // // console.log(Object.getOwnPropertyNames(comp));
  // console.log(typeof comp.claimComp);
  // // console log all comp functions
  // for (const key in comp) {
  //   console.log(key);
  // }
  // await comp['claimComp(address)'](signer.address);
  // console.log(typeof comp['claimComp(address)']);
  const tx = await comp['claimComp(address)'](signer.address);
  await tx.wait();

  process.exit(0);
}

main();