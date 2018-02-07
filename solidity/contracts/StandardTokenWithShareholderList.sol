pragma solidity ^0.4.8;

import './DevContract.sol';
import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';


contract StandardTokenWithShareholderList is DevContract, StandardToken{

    string public symbol = "";
    string public name = "";
    address[] public shareholders;

    event NewShareholderList(address[] shareholders);
    event BalanceUpdated(uint oldBalance, uint newBalance, uint balance);
    event TransferSuccess(bool success);

    modifier devFlag {
        require(active);
        _;
    }

    function StandardTokenWithShareholderList(string _symbol,
    string _name,
    bool _dev) public DevContract(_dev) {
        symbol = _symbol;
        name = _name;
    }

    // the dev methods for only testing to invoke private and internal methods
    function setBalanceDev(address user, uint256 newBalance) public devFlag {
        setBalance(user, newBalance);
    }

    function removeShareholderDev(address user) public devFlag {
        removeShareholder(user);
    }

    function onBalanceChangeDev(address user, uint256 oldBalance, uint256 newBalance) public devFlag {
        onBalanceChange(user, oldBalance, newBalance);
    }

    function transfer(address dst, uint wad) public returns (bool) {
        uint oldBalanceDest = balances[dst];
        uint oldBalanceSender = balances[msg.sender];
        bool result = BasicToken.transfer(dst, wad);
        onBalanceChange(msg.sender, oldBalanceSender, balances[msg.sender]);
        onBalanceChange(dst, oldBalanceDest, balances[dst]);
        TransferSuccess(result);
        return result;
    }

    function transferFrom(address src, address dst, uint wad) public returns (bool) {
        uint oldBalanceDest = balances[dst];
        uint oldBalanceSrc = balances[src];
        bool result = StandardToken.transferFrom(src, dst, wad);
        onBalanceChange(src, oldBalanceSrc, balances[src]);
        onBalanceChange(dst, oldBalanceDest, balances[dst]);
        return result;
    }

    function getShareholderCount() public constant returns(uint count) {
        uint length = 0;
        for (uint i = 0; i < shareholders.length; i++) {
            // check that the address in the list is not set = 0x0...
            if (shareholders[i] != address(0)) {
                length++;
            }
        }
        return length;
    }

    function getBalance(address user) public returns (uint) {
        return balances[user];
    }

    function isShareholder(address userAddress) public returns (bool shareholder) {
        return balances[userAddress] > 0;
    }

    function removeShareholder(address user) internal {
        for (uint i = 0; i < shareholders.length; i++) {
            if (shareholders[i] == user) {
                delete shareholders[i];
                NewShareholderList(shareholders);
                return;
            }
        }
        //If we did not find the shareholder to be removed we have a programming error
        revert();
    }

    function setBalance(address user, uint256 newBalance) internal {
        uint oldBalance = balances[user];
        balances[user] = newBalance;
        BalanceUpdated(oldBalance, newBalance, balances[user]);
        onBalanceChange(user, oldBalance, newBalance);
    }

    function onBalanceChange(address user, uint256 oldBalance, uint256 newBalance) private {
        if (oldBalance == 0 && newBalance != 0) {
            shareholders.push(user);
        } else {
            if (oldBalance != 0 && newBalance == 0) {
                removeShareholder(user);
            }
        }
        NewShareholderList(shareholders);
    }
}
