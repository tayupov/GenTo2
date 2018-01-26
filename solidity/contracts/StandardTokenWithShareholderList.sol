pragma solidity ^0.4.8;

import './DevContract.sol';
import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';

contract StandardTokenWithShareholderList is DevContract, StandardToken{

    string public symbol = "";
    string public name = "";
    address[] public shareholders;

    event NewShareholderList(accounts[] shareholders);

    function StandardTokenWithShareholderList(string _symbol,
    string _name,
    bool _dev)  public DevContract(_dev) {
        symbol = _symbol;
        name = _name;
    }

    function isShareholder(address userAddress) public returns (bool shareholder) {
        return balances[userAddress] > 0;
    }

    function transfer(address dst, uint wad) public returns (bool) {
        uint oldBalanceDest = balances[dst];
        uint oldBalanceSender = balances[msg.sender];
        bool result = BasicToken.transfer(dst, wad);
        onBalanceChange(msg.sender, oldBalanceSender, balances[msg.sender]);
        onBalanceChange(dst, oldBalanceDest, balances[dst]);
        return result;
    }

    function transferFrom(address src, address dst, uint wad) public returns (bool) {
        uint oldBalanceDest = balances[dst];
        uint oldBalanceSrc = balances[src];
        bool result = StandardToken.transferFrom(src, dst, wad);
        /* onBalanceChange(src, oldBalanceSrc, balances[src]);
        onBalanceChange(dst, oldBalanceDest, balances[dst]); */
        //return result;
        return true;
    }

    function removeShareholder(address user) /*internal*/ public {
        for (uint i = 0; i < shareholders.length; i++) {
            if (shareholders[i] == user) {
                delete shareholders[i];
                return;
            }
        }
        //If we did not find the shareholder to be removed we have a programming error
        revert();
    }

    function setBalance(address user, uint256 newBalance) /*internal*/ public {
        uint oldBalance = balances[user];
        balances[user] = newBalance;
        onBalanceChange(user, oldBalance, newBalance);
    }

    function onBalanceChange(address user, uint256 oldBalance, uint256 newBalance) /*private*/ public {
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
