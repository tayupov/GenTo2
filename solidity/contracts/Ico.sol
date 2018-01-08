pragma solidity ^0.4.8;

import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';

contract Ico is StandardToken{

    uint256 public buyPriceStart;
    uint256 public buyPriceEnd;
    uint256 public sellPrice;
    uint256 public bal = 0;

    uint256 saleStart = 0;
    uint256 saleEnd = 0;
    uint256 saleDuration = 0;

    event MyTransfer(address indexed to, uint256 value, uint256 remainingSupply);

    function currentTime() returns (uint time);
    function initShareholder(address shareholder);

    modifier icoRunning {
        //if (!isShareholder(msg.sender)) throw;
        require(saleStart <= currentTime());
        require(saleEnd > currentTime());
        _;
    }

    function getBuyPrice() icoRunning constant returns (uint) {
        uint currentPrice;
        uint passed;

        passed = currentTime() - saleStart;

        currentPrice = buyPriceStart + (((buyPriceEnd - buyPriceStart) * passed) / saleDuration);

        return currentPrice;
    }
    function isShareholder(address userAddress) returns (bool shareholder);

    function buy() icoRunning payable returns (uint amount) {
        bool shareHolder =  isShareholder(msg.sender);
        // calculates the amount
        amount = msg.value / getBuyPrice();
        // checks if it has enough to sell
        require(bal > amount);
        require(amount > 0);
        //if (balances[owner] < amount || amount <= 0) throw;
        // adds the amount to buyer's balance
        balances[msg.sender] += amount;
        // subtracts amount from seller's balance
        bal -= amount;
        if(!shareHolder){
            initShareholder(msg.sender);
        }
        // execute an event reflecting the change
        MyTransfer(msg.sender, amount, bal);

        // ends function and returns
        return amount;
    }

}