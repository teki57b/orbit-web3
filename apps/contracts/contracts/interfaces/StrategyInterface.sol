// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface StrategyInterface {
    function name() external view returns (string memory);

    function vault() external view returns (address);

    function want() external view returns (address);

    function keeper() external view returns (address);

    function estimatedTotalAssets() external view returns (uint256);

    function harvestTrigger(uint256 callCost) external view returns (bool);

    function harvest() external;

    function withdraw(uint256 amount) external returns (uint256);

    event Harvested(uint256 profit, uint256 loss, uint256 debtPayment, uint256 debtOutstanding);
}