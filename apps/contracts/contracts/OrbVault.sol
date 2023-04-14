// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./OrbToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OrbVault {
    OrbToken public immutable token;

    uint256 public totalSupply;
    uint256 public totalAsset;
    mapping(address => uint256) public balanceOf;

    constructor(address _token) {
        token = OrbToken(_token);
    }

    event Deposited(uint256 assetDeposited, uint256 shareMinted);
    event Withdrawn(uint256 assetWithdrawn, uint256 shareBurnt);

    function _mint(address _to, uint256 _shares) private {
        token.mint(_to, _shares);
        totalSupply += _shares;
        balanceOf[_to] += _shares;
    }

    function _burn(address _from, uint256 _shares) private {
        token.burn(_from, _shares);
        totalSupply -= _shares;
        balanceOf[_from] -= _shares;
    }

    function deposit(uint256 amountToDeposit) external payable {
        require(amountToDeposit == msg.value, "incorrect ETH amount");
        totalAsset += amountToDeposit;
        uint256 sharesToMint;
        if (totalSupply == 0) {
            sharesToMint = amountToDeposit;
        } else {
            uint unitPrice = totalAsset / totalSupply;
            sharesToMint = amountToDeposit / unitPrice;
        }
        _mint(msg.sender, sharesToMint);
        emit Deposited(amountToDeposit, sharesToMint);
    }

    function withdraw(uint256 _shares) external {
        require(balanceOf[msg.sender] >= _shares, "not enough shares");
        uint256 unitPrice = totalAsset / totalSupply;
        uint256 amountToWithdraw = unitPrice * _shares;
        totalAsset -= amountToWithdraw;
        _burn(msg.sender, _shares);
        payable(msg.sender).transfer(amountToWithdraw);
        emit Withdrawn(amountToWithdraw, _shares);
    }
}
