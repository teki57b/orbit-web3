import fs from 'fs';

export interface ContractAddresses {
  want: string;
  market: string;
  reward: string;
  comptroller: string;
}

export interface DeployedContracts {
  lender: string;
}

export async function getContractAddresses() {
  // load contracts from local json file
  const contracts = JSON.parse(fs.readFileSync(`./scripts/v3bb/addresses.json`).toString());

  return contracts as ContractAddresses;
}

export async function getDeployedContracts() {
  // load contracts from local json file
  const contracts = JSON.parse(fs.readFileSync(`./scripts/v3bb/deployed.json`).toString());

  return contracts as DeployedContracts;
}
