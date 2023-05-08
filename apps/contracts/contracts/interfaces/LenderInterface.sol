// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface LenderInterface {
  function lenderName() external view returns (string memory);

    function nav() external view returns (uint256);

    function apr() external view returns (uint256);

    function weightedApr() external view returns (uint256);

    function withdraw(uint256 amount) external returns (uint256);

    function deposit() external;

    function withdrawAll() external returns (bool);

    function hasAssets() external view returns (bool);

    function aprAfterDeposit(uint256 amount) external view returns (uint256);
}