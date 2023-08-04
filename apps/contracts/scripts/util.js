"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEventLoop = exports.deployUpgradeableContract = exports.deployContractWithDeployer = exports.deployContract = exports.upgradeContract = void 0;
const hardhat_1 = require("hardhat");
async function upgradeContract(upgraderAddress, contractName, proxyAddress) {
    console.log(`upgrade proxy: ${proxyAddress} to contract: ${contractName} as account: ${upgraderAddress}`);
    const contractFactory = await hardhat_1.ethers.getContractFactory(contractName);
    const upgradedContract = await hardhat_1.upgrades.upgradeProxy(proxyAddress, contractFactory, { kind: 'uups' });
    console.log(`contract ${contractName} deployed with address ${upgradedContract.address}`);
    return upgradedContract;
}
exports.upgradeContract = upgradeContract;
async function deployContract(contractName, args, isSilent) {
    if (!isSilent) {
        console.log(`deploy contract: ${contractName} with args:`, ...args);
    }
    const contractFactory = await hardhat_1.ethers.getContractFactory(contractName);
    const contract = await contractFactory.deploy(...args);
    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json')),
    };
    // fs.writeFileSync(`${__dirname}/generated/${contractName}.json`, JSON.stringify(data));
    if (!isSilent) {
        console.log(`contract ${contractName} deployed with address ${contract.address}`);
    }
    return contract;
}
exports.deployContract = deployContract;
async function deployContractWithDeployer(deployer, contractName, args, isSilent) {
    if (!isSilent) {
        console.log(`deploy contract: ${contractName} with args:`, ...args);
    }
    const contractFactory = await hardhat_1.ethers.getContractFactory(contractName, deployer);
    const contract = await contractFactory.deploy(...args);
    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json')),
    };
    // fs.writeFileSync(`${__dirname}/generated/${contractName}.json`, JSON.stringify(data));
    if (!isSilent) {
        console.log(`contract ${contractName} deployed with address ${contract.address}`);
    }
    return contract;
}
exports.deployContractWithDeployer = deployContractWithDeployer;
async function deployUpgradeableContract(deployer, contractName, args, silient) {
    if (!silient) {
        console.log(`deploy contract: ${contractName} as account: `, deployer.address, ` with args:`, ...args);
    }
    const contractFactory = await hardhat_1.ethers.getContractFactory(contractName, deployer);
    const contract = await hardhat_1.upgrades.deployProxy(contractFactory, args, { kind: 'uups' });
    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json')),
    };
    if (!silient) {
        console.log(`contract ${contractName} deployed with address ${contract.address}`);
    }
    return contract;
}
exports.deployUpgradeableContract = deployUpgradeableContract;
/**
 * Using a loop to iterate all the topics to see if there are matching events
 */
async function extractEventLoop(tx, eventName, eventInterfaceRaw) {
    const receipt = await hardhat_1.ethers.provider.getTransactionReceipt(tx.hash);
    const eventInterface = new hardhat_1.ethers.utils.Interface([eventInterfaceRaw]);
    const events = [];
    for (const log of receipt.logs) {
        const { topics, data } = log;
        try {
            const e = eventInterface.decodeEventLog(eventName, data, topics);
            events.push(e);
        }
        catch (e) {
            continue;
        }
    }
    return events;
}
exports.extractEventLoop = extractEventLoop;
//# sourceMappingURL=util.js.map