"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const util_1 = require("../scripts/util");
describe('TokenFaucet', () => {
    let tokenFaucet;
    let deployer;
    let user1;
    let erc20Token;
    const faucet = {
        amount: hardhat_1.ethers.utils.parseUnits('10000', 'ether'),
        frequency: 1, //will allow people to request funds every block (so essentially every ~5s)
    };
    beforeEach(async () => {
        [deployer, user1] = await hardhat_1.ethers.getSigners();
        erc20Token = await (0, util_1.deployContractWithDeployer)(deployer, 'ERC20Token', ['SOOLLL', 'SOOLLL'], false);
        tokenFaucet = await (0, util_1.deployUpgradeableContract)(deployer, 'TokenFaucet', [
            erc20Token.address,
            faucet.amount,
            faucet.frequency,
        ]);
    });
    describe('fund', async () => {
        it('works', async () => {
            const connected = tokenFaucet.connect(deployer);
            const totalAmount = await erc20Token.balanceOf(deployer.address);
            await erc20Token.approve(tokenFaucet.address, totalAmount);
            await connected.donate(erc20Token.address, totalAmount);
            await tokenFaucet.fund(user1.address);
            const userBalance = await erc20Token.balanceOf(user1.address);
            const faucetBalance = await erc20Token.balanceOf(tokenFaucet.address);
            console.log(hardhat_1.ethers.utils.formatEther(userBalance), hardhat_1.ethers.utils.formatEther(faucetBalance), 'balance');
        });
    });
});
//# sourceMappingURL=faucet.spec.js.map