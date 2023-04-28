// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OrbVault is ERC20, Ownable {
    ERC20 public immutable managingToken;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    uint256 public totalDebt;

    constructor(address _token) ERC20("", "") {
        managingToken = ERC20(_token);
        // set _name and _symbol with the values from managingToken
        _name = string(abi.encodePacked(managingToken.name(), " oVault"));
        _symbol = string(abi.encodePacked("ov", managingToken.symbol()));
        _decimals = managingToken.decimals();
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function _totalAssets() internal view returns (uint256) {
        return managingToken.balanceOf(address(this)) + totalDebt;
    }

    function totalAssets() external view returns (uint256) {
        return _totalAssets();
    }

    function _issueShares(
        address _to,
        uint256 _amount
    ) internal returns (uint256) {
        uint256 shares_ = 0;
        uint256 totalSupply = totalSupply();
        if (totalSupply == 0) {
            shares_ = _amount;
        } else {
            shares_ = (_amount * totalSupply) / _totalAssets();
        }
        _mint(_to, _amount);
        return shares_;
    }

    function deposit(uint256 _amount) external returns (uint256) {
        require(
            _amount > 0,
            "vault: deposit amount must be greater than 0"
        );
        uint256 shares_ = _issueShares(msg.sender, _amount);
        managingToken.transferFrom(msg.sender, address(this), _amount);
        return shares_;
    }


}
