// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/VaultInterface.sol";
import "./interfaces/MarketInterface.sol";

contract Strategy {
    using SafeMath for uint256;
    VaultInterface public vault;

    address public keeper;

    IERC20 public want;

    MarketInterface public market;

    uint256 public minReportDelay;

    uint256 public maxReportDelay;

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
        if (_balance > 0) {
            want.approve(address(market), _balance);
            market.mint(_balance);
        }
    }

    event Harvested(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 debtOutstanding
    );

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
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}
