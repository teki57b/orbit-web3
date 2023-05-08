// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/MarketInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Market is ERC20, MarketInterface {
    IERC20 public immutable underlying;

    constructor(address _token) ERC20("MarketToken", "MKT") {
        underlying = IERC20(_token);
    }

    function exchangeRateStored() external pure override returns (uint) {
      return 1.5e18;
    }

    function mint(uint mintAmount) external override returns (uint) {
      underlying.transferFrom(msg.sender, address(this), mintAmount);
      uint256 toMint = mintAmount * 1e18 / 1.5e18;
      _mint(msg.sender, toMint);
      return toMint;
    }

    function redeem(uint redeemTokens) external override returns (uint) {
      uint256 redeemAmount = redeemTokens * 1.5e18 / 1e18;
      _burn(msg.sender, redeemTokens);
      underlying.transfer(msg.sender, redeemAmount);
      return redeemAmount;
    }

    function redeemUnderlying(
        uint redeemAmount
    ) external override returns (uint) {
      uint256 redeemTokens = redeemAmount * 1e18 / 1.5e18;
      _burn(msg.sender, redeemTokens);
      underlying.transfer(msg.sender, redeemAmount);
      return redeemAmount;
    }
}
