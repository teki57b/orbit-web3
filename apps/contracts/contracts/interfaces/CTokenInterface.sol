// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface CTokenInterface is IERC20 {

    function balanceOfUnderlying(address owner) external returns (uint);

    function getAccountSnapshot(
        address account
    ) external view returns (uint, uint, uint, uint);

    function borrowRatePerBlock() external view returns (uint);

    function supplyRatePerBlock() external view returns (uint);

    function totalBorrowsCurrent() external returns (uint);

    function borrowBalanceCurrent(
        address account
    ) external returns (uint);

    function borrowBalanceStored(
        address account
    ) external view returns (uint);

    function exchangeRateCurrent() external returns (uint);

    function exchangeRateStored() external view returns (uint);

    function getCash() external view returns (uint);

    function accrueInterest() external returns (uint);

    function seize(
        address liquidator,
        address borrower,
        uint seizeTokens
    ) external returns (uint);
}
