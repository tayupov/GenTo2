pragma solidity ^0.4.8;

import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';

contract AuctionToken is StandardToken {

    uint256 public buyPriceStart;
    uint256 public buyPriceEnd;

    //What is this for?
    uint256 public sellPrice;

    uint256 saleStart = 0;
    uint256 saleEnd = 0;
    uint256 saleDuration = 0;

    string public symbol = "";
    string public name = "";

    uint256 public creationDate;

    uint8 public constant decimals = 18;
    uint256 totalSupply = 0;

    address public owner;

    function AuctionToken(uint256 _totalSupply,
      address _owner,
      string _symbol,
      string _name,
      uint256 _buyPriceStart,
      uint256 _buyPriceEnd,
      uint256 _sellPrice,
      uint256 _saleStart,
      uint256 _saleEnd) {
        require(_saleEnd > _saleStart);

        buyPriceStart = _buyPriceStart;
        buyPriceEnd = _buyPriceEnd;

        sellPrice = _sellPrice;
        saleEnd = _saleEnd;
        saleStart = _saleStart;
        saleDuration = saleEnd - saleStart;

        owner = _owner;
        totalSupply = _totalSupply;
        balances[owner] = _totalSupply;
        symbol = _symbol;
        name = _name;
        creationDate = now;
    }

    function getBuyPrice() constant returns (uint) {
        uint currentPrice;
        uint passed;
        passed = now - saleStart;
        if(buyPriceStart < buyPriceEnd) {
            currentPrice = buyPriceStart + (((buyPriceEnd - buyPriceStart) * passed) / saleDuration);
        } else if (buyPriceStart > buyPriceEnd) {
            currentPrice = buyPriceStart - (((buyPriceStart - buyPriceEnd) * passed) / saleDuration);
        } else {
            currentPrice = buyPriceStart;
        }
        if(currentPrice <= 0){
            currentPrice = 1;
        }
        return currentPrice;
    }

    function getDetails() constant returns (address _owner,
                                            string _name,
                                            string _symbol,
                                            uint256 _totalSupply,
                                            uint256 _creationDate,
                                            uint256 _buyPriceStart,
                                            uint256 _buyPriceEnd,
                                            uint256 _sellPrice,
                                            uint256 _saleStart,
                                            uint256 _saleEnd){
        return (owner, name, symbol, totalSupply, creationDate, buyPriceStart, buyPriceEnd, sellPrice, saleStart, saleEnd);
    }
    function buy() payable returns (uint amount){
        amount = msg.value / getBuyPrice();                     // calculates the amount
        if (balances[owner] < amount || amount <= 0) throw;     // checks if it has enough to sell
        balances[msg.sender] += amount;                   // adds the amount to buyer's balance
        balances[owner] -= amount;                         // subtracts amount from seller's balance
        Transfer(owner, msg.sender, amount, balances[owner]);                // execute an event reflecting the change
        return amount;                                     // ends function and returns
    }
/*
    function sell(uint amount) returns (uint256 revenue){
        if (balances[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
        balances[owner] += amount;                         // adds the amount to owner's balance
        balances[msg.sender] -= amount;                   // subtracts the amount from seller's balance
        revenue = amount * sellPrice;
        if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's important
            throw;                                         // to do owner last to prevent recursion attacks
        } else {
            Transfer(msg.sender, owner, amount);             // executes an event reflecting on the change
            return revenue;                                 // ends function and returns
        }
    }*/
}
