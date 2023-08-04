import fs from 'fs';

export interface ContractAddresses {
  want: string;
  vault: string;
  strategy: string;
  market: string;
}

export async function getContractAddresses() {

  // load contracts from local json file
  const contracts = JSON.parse(fs.readFileSync(`./scripts/v2/contracts.json`).toString());

  return contracts as ContractAddresses;
}
