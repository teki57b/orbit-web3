"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const util_1 = require("../scripts/util");
describe('TokenFactory', () => {
    let tokenFactory;
    let deployer;
    let erc20Token;
    beforeEach(async () => {
        [deployer] = await hardhat_1.ethers.getSigners();
        tokenFactory = await (0, util_1.deployUpgradeableContract)(deployer, 'TokenFactory', []);
        erc20Token = await (0, util_1.deployContractWithDeployer)(deployer, 'ERC20Token', ['FTF', 'ftf'], false);
    });
    it("can't create the an instance for the parameters twice", async () => {
        const parameters = ['USD Coin', 'USDC', hardhat_1.ethers.BigNumber.from(10).pow(6 + 6), 6];
        const tx = await tokenFactory.createToken(...parameters);
        const createInterface = 'address token,address creator,string name,string symbol,uint limit,uint8 decimals';
        const event = await (0, util_1.extractEventLoop)(tx, 'TokenCreated', `event TokenCreated(${createInterface})`);
        console.log(event);
    });
});
//# sourceMappingURL=factory.spec.js.map