"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("solidity-coverage");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
// proxy
require("@openzeppelin/hardhat-upgrades");
require("hardhat-contract-sizer");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, './.env') });
// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'privatKey';
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
            accounts: [PRIVATE_KEY],
            initialBaseFeePerGas: 0,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            gasPrice: 80000000000,
        },
        // bscTestnet: {
        //   url: 'https://data-seed-prebsc-2-s1.binance.org:8545',
        //   chainId: 97,
        //   gasPrice: 80_000_000_000,
        //   accounts: [`0x${process.env.BSC_TESTNET_DEPLOYER_PRIVATE_KEY}`],
        // },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.9',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        outputFile: 'gas-report.txt',
        noColors: true,
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map