// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CTokenInterface.sol";

interface MarketInterface is CTokenInterface {
    function mint(uint mintAmount) external returns (uint);

    function redeem(uint redeemTokens) external returns (uint);

    function redeemUnderlying(
        uint redeemAmount
    ) external returns (uint);

    // function borrow(uint borrowAmount) external returns (uint);

    // function repayBorrow(uint repayAmount) external returns (uint);

    // function repayBorrowBehalf(
    //     address borrower,
    //     uint repayAmount
    // ) external returns (uint);

    // function liquidateBorrow(
    //     address borrower,
    //     uint repayAmount,
    //     CTokenInterface cTokenCollateral
    // ) external returns (uint);
}
