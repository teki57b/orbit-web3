// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/VaultInterface.sol";
import "./interfaces/MarketInterface.sol";
import "./SafeMath.sol";

contract Strategy {
    using SafeMath for uint256;
    VaultInterface public vault;

    address public keeper;

    IERC20 public want;

    MarketInterface public market;

    uint256 public minReportDelay;

    uint256 public maxReportDelay;

    // lower bound to stop borrowing
    uint256 public constant LOWER_BOUND = 1e8;

    event Harvested(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding
    );

    event PositionAdjusted(uint256 debtPayment, uint256 debtOutstanding);

    constructor(address _vault, address _market) {
        vault = VaultInterface(_vault);
        want = IERC20(vault.token());
        want.approve(_vault, type(uint256).max);
        market = MarketInterface(_market);
        keeper = msg.sender;
    }

    function name() external pure returns (string memory) {
        return "SimpleStrategy";
    }

    function harvestTrigger(
        uint256 callCostInWei
    ) external view returns (bool) {
        StrategyParams memory params = vault.strategies(address(this));

        // // Should not trigger if Strategy is not activated
        // if (params.activation == 0) return false;

        // // Should not trigger if we haven't waited long enough since previous harvest
        // if (block.timestamp.sub(params.lastReport) < minReportDelay)
        //     return false;

        // // Should trigger if hasn't been called in a while
        // if (block.timestamp.sub(params.lastReport) >= maxReportDelay)
        //     return true;

        uint256 total = estimatedTotalAssets();
        uint256 profit = total > params.totalDebt
            ? total - params.totalDebt
            : 0;
        // FIXME: should translate profit(in want) to eth
        return (profit > callCostInWei);
    }

    function harvest() external {
        uint256 _profit = 0;
        uint256 _loss = 0;
        // FIXME: deal with debt later
        uint256 _debtPayment = 0;
        uint256 _debtOutstanding = 0;
        (_profit, _loss, _debtPayment) = prepareReturn();
        vault.report(_profit, _loss, _debtPayment);
        emit Harvested(_profit, _loss, _debtPayment, _debtOutstanding);
        adjustPosition();
    }

    function adjustPosition() internal {
        uint256 _balance = want.balanceOf(address(this));
        while (_balance > LOWER_BOUND) {
            bool success = want.approve(address(market), _balance);
            require(success, "approve failed");
            market.mint(_balance);
            // get account snapshot
            (, uint256 cTokenBalance, , uint256 exchangeRateMantissa) = market
                .getAccountSnapshot(address(this));
            // borrow 70% of supplied
            uint256 borrowable = cTokenBalance
                .mul(exchangeRateMantissa)
                .div(1e18)
                .mul(7)
                .div(10);
            uint256 borrowed = market.borrow(borrowable);
            market.mint(borrowed);
            _balance = want.balanceOf(address(this));
        }
    }

    // lent assets plus loose assets
    function estimatedTotalAssets() public view returns (uint256) {
        uint256 nav = lentTotalAssets();
        nav = nav.add(want.balanceOf(address(this)));
        return nav;
    }

    function lentTotalAssets() public view returns (uint256) {
        uint256 currentCToken = market.balanceOf(address(this));
        uint256 nav = 0;
        nav = currentCToken.mul(market.exchangeRateStored()).div(1e18);
        return nav;
    }

    function prepareReturn()
        internal
        returns (uint256 _profit, uint256 _loss, uint256 _debtPayment)
    {
        uint256 lentAssets = lentTotalAssets();

        uint256 looseAssets = want.balanceOf(address(this));

        uint256 total = looseAssets.add(lentAssets);

        uint256 debt = vault.strategies(address(this)).totalDebt;
        _profit = total > debt ? total - debt : 0;
        _loss = total < debt ? debt - total : 0;
        if (_profit > looseAssets) {
            market.redeemUnderlying(_profit - looseAssets);
        }
        _debtPayment = 0;
    }

    function withdraw(uint256 amount) external returns (uint256) {
        uint256 _balance = want.balanceOf(address(this));
        if (_balance < amount) {
            market.redeemUnderlying(amount - _balance);
        }
        want.transfer(msg.sender, amount);
        return amount;
    }
}
