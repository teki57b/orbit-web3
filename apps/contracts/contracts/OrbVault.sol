// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/StrategyInterface.sol";
import "./interfaces/VaultInterface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract OrbVault is ERC20, Ownable, VaultInterface {
    ERC20 public immutable want;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    uint256 public totalDebt;

    mapping (address => StrategyParams) private _strategies;
    // withdrawal queue
    uint256 public constant MAX_STRATEGIES = 10;
    address[] private _withdrawalQueue;

    constructor(address _token) ERC20("", "") {
        want = ERC20(_token);
        // set _name and _symbol with the values from want
        _name = string(abi.encodePacked(want.name(), " Vault"));
        _symbol = string(abi.encodePacked("v", want.symbol()));
        _decimals = want.decimals();
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
        return want.balanceOf(address(this)) + totalDebt;
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
        _mint(_to, shares_);
        return shares_;
    }

    function deposit(uint256 _amount) external returns (uint256) {
        require(_amount > 0, "vault: deposit amount must be greater than 0");
        want.transferFrom(msg.sender, address(this), _amount);
        uint256 shares_ = _issueShares(msg.sender, _amount);
        return shares_;
    }

    function _redeemShares(
        address _from,
        uint256 _shares
    ) internal returns (uint256) {
        uint256 amount_ = (_shares * _totalAssets()) / totalSupply();
        uint256 totalLoss = 0;
        if (amount_ > want.balanceOf(address(this))) {
            for (uint256 i = 0; i < _withdrawalQueue.length; i++) {
                uint256 vaultBalance = want.balanceOf(address(this));
                StrategyInterface strategy = StrategyInterface(_withdrawalQueue[i]);
                StrategyParams storage params = _strategies[_withdrawalQueue[i]];

                uint256 amountNeeded = amount_ - vaultBalance;
                amountNeeded = Math.min(amountNeeded, params.totalDebt);
                if (amountNeeded == 0) {
                    continue;
                }
                uint256 loss = strategy.withdraw(amountNeeded);
                uint256 withdrawn = want.balanceOf(address(this)) - vaultBalance;

                if (loss > 0) {
                    params.totalLoss += loss;
                    amount_ -= loss;
                    totalLoss += loss;
                }
                params.totalDebt -= withdrawn + loss;
                totalDebt -= withdrawn + loss;

                if (amount_ <= want.balanceOf(address(this))) {
                    break;
                }
            }
        }

        uint256 afterWithdraw = want.balanceOf(address(this));

        if (amount_ > afterWithdraw) {
            amount_ = afterWithdraw;
            _shares = amount_ * totalSupply() / _totalAssets();
        }
        
        _burn(_from, _shares);
        return amount_;
    }


    function withdraw(uint256 _shares) external returns (uint256) {
        require(_shares > 0, "vault: withdraw shares must be greater than 0");
        uint256 amount_ = _redeemShares(msg.sender, _shares);
        want.transfer(msg.sender, amount_);
        return amount_;
    }

    function pricePerShare() external view returns (uint256) {
        return _totalAssets() / totalSupply();
    }

    function report(
        uint256 _gain,
        uint256 _loss,
        uint256 _debtPayment
    ) external returns (uint256) {
        _strategies[msg.sender].totalGain += _gain;
        uint credit = this.creditAvailable();
        if (credit > 0) {
            _strategies[msg.sender].totalDebt += credit;
            totalDebt += credit;
        }
        if (_gain < credit) {
            want.transfer(msg.sender, credit - _gain);
        }
        if (_gain > credit) {
            want.transferFrom(msg.sender, address(this), _gain - credit);
        }

        // update strategy param
        _strategies[msg.sender].totalLoss += _loss;
        _strategies[msg.sender].totalDebt -= _debtPayment;
        totalDebt -= _debtPayment;
        _strategies[msg.sender].lastReport = block.timestamp;
        
        // FIXME: should return debt outstanding
        return 0;

    }

    /**
     * @dev Returns the amount of credit available for the given address.
     * Strategy calls this method to determine how much it can borrow.
     */
    function creditAvailable() external view returns (uint256) {
        // FIXME: all to the calling strategy
        return want.balanceOf(address(this));
    }

    function addStrategy(address _strategy) external onlyOwner {
        require(_withdrawalQueue.length < MAX_STRATEGIES, "vault: max strategies reached");
        require(_strategy != address(0), "vault: strategy address is zero");
        require(_strategies[_strategy].activation == 0, "vault: strategy already exists");
        _strategies[_strategy] = StrategyParams({
            performanceFee: 0,
            activation: block.timestamp,
            debtRatio: 0,
            minDebtPerHarvest: 0,
            maxDebtPerHarvest: 0,
            lastReport: 0,
            totalDebt: 0,
            totalGain: 0,
            totalLoss: 0
        });
        _withdrawalQueue.push(_strategy);
    }

    function token() external view override returns (address) {
        return address(want);
    }

    function strategies(
        address _strategy
    ) external view override returns (StrategyParams memory) {
        return _strategies[_strategy];
    }
}
