pragma solidity ^0.4.8;

import './StandardTokenWithShareholderList.sol';

contract DaoWithIco is StandardTokenWithShareholderList{

    uint256 public buyPriceStart;
    uint256 public buyPriceEnd;
    uint256 public remainingTokensForICOPurchase = 0;

    uint256 public saleStart = 0;
    uint256 public saleEnd = 0;
    uint256 internal saleDuration = 0;

    uint256 public totalSupply;
    event ICOPurchase(address indexed to, uint256 value, uint256 remainingSupply);

    modifier icoRunning {
        require(saleStart <= currentTime());
        require(saleEnd > currentTime());
        _;
    }

    modifier daoActive {
      require(saleEnd <= currentTime());
      _;
    }
    function DaoWithIco(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) StandardTokenWithShareholderList(_symbol, _name, _dev)  public 
    {
        require(_saleEnd > _saleStart);

        buyPriceStart = _buyPriceStart;
        buyPriceEnd = _buyPriceEnd;

        saleEnd = _saleEnd;
        saleStart = _saleStart;
        saleDuration = saleEnd - saleStart;

        remainingTokensForICOPurchase = _maxAmountToRaiseInICO;
        totalSupply = 0;
    }

    function getBuyPrice() public constant returns (uint) {
        uint currentPrice;
        uint passed;

        passed = currentTime() - saleStart;
        currentPrice = buyPriceStart + (((buyPriceEnd - buyPriceStart) * passed) / saleDuration);
        return currentPrice;
    }

    function buy() icoRunning public payable returns (uint amount) {
        // calculates the amount
        amount = msg.value / getBuyPrice();
        // checks if it has enough to sell
        require(remainingTokensForICOPurchase > amount);
        require(amount > 0);
        StandardTokenWithShareholderList.setBalance(msg.sender, balances[msg.sender]+amount);
        // subtracts amount from seller's balance
        remainingTokensForICOPurchase -= amount;
        totalSupply += amount;
        // execute an event reflecting the change
        ICOPurchase(msg.sender, amount, remainingTokensForICOPurchase);

        // ends function and returns
        return amount;
    }

    function isIcoFinished() public constant returns (bool icoFinished){
        return saleEnd <= currentTime();
    }
}
