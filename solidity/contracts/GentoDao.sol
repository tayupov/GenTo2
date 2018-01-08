pragma solidity ^0.4.8;

import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';
import './Proposal.sol';

contract GentoDao is StandardToken, ProposalToken {

    uint256 public buyPriceStart;
    uint256 public buyPriceEnd;

    uint256 public sellPrice;

    uint256 saleStart = 0;
    uint256 saleEnd = 0;
    uint256 saleDuration = 0;

    string public symbol = "";
    string public name = "";

    uint256 public creationDate;

    uint8 public constant decimals = 18;
    uint256 public bal = 0;
    uint256 totalSupply = 0;

    address[] public shareholders;

    bool dev;
    uint cTime;

    mapping(address => mapping(uint => address)) delegations;

    event MyTransfer(address indexed to, uint256 value, uint256 remainingSupply);

    modifier icoRunning {
        //if (!isShareholder(msg.sender)) throw;
        require(saleStart <= currentTime());
        require(saleEnd > currentTime());
        _;
    }


    modifier icoFinished {
        //if (!isShareholder(msg.sender)) throw;
        require(saleEnd <= currentTime());
        _;
    }

    function GentoDao(uint256 _totalSupply,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _sellPrice,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) {
        require(_saleEnd > _saleStart);

        buyPriceStart = _buyPriceStart;
        buyPriceEnd = _buyPriceEnd;

        sellPrice = _sellPrice;
        saleEnd = _saleEnd;
        saleStart = _saleStart;
        saleDuration = saleEnd - saleStart;

        totalSupply = _totalSupply;
        bal = _totalSupply;
        symbol = _symbol;
        name = _name;

        dev = _dev;
        if (_dev) {
            creationDate = 0;
        }
        else {
            creationDate = now;
        }
    }
    function isShareholder(address userAddress) returns (bool shareholder){
        return balances[userAddress] > 0;
    }
    function isIcoFinished() returns (bool icoFinished){
        return saleEnd <= currentTime();
    }



    function getBalance() returns(uint balance) {
        return this.balance;
    }

    function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) returns (uint influence){
        uint influence1 = 0;
        for (uint i = 0; i < shareholders.length; ++i) {
            // NumberLogger('shareholders.length', shareholders.length);
            // AddressLogger("delegations[shareholders[i]][uint(fieldOfWork)]", delegations[shareholders[i]][uint(fieldOfWork)]);
            // AddressLogger("voter", voter);
            // NumberLogger("balances[shareholders[i]]", balances[shareholders[i]]);
            // NumberLogger("influence1", influence1);
            if (delegations[shareholders[i]][uint(fieldOfWork)] == voter){
                influence1 += balances[shareholders[i]];
            }
        }

        return influence1;
    }

    function getBuyPrice() icoRunning constant returns (uint) {
        uint currentPrice;
        uint passed;

        passed = currentTime() - saleStart;

        currentPrice = buyPriceStart + (((buyPriceEnd - buyPriceStart) * passed) / saleDuration);
        /*
                if(buyPriceStart < buyPriceEnd) {
                    currentPrice = buyPriceStart + (((buyPriceEnd - buyPriceStart) * passed) / saleDuration);
                } else if (buyPriceStart > buyPriceEnd) {
                    currentPrice = buyPriceStart - (((buyPriceStart - buyPriceEnd) * passed) / saleDuration);
                } else {
                    currentPrice = buyPriceStart;
                }
                if(currentPrice <= 0){
                    currentPrice = 1;
                }*/
        return currentPrice;
    }

    function getDetails() constant returns (string _name,
    string _symbol,
    uint256 _totalSupply,
    uint256 _creationDate,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _sellPrice,
    uint256 _saleStart,
    uint256 _saleEnd){
        return (name, symbol, totalSupply, creationDate, buyPriceStart, buyPriceEnd, sellPrice, saleStart, saleEnd);
    }
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
            delegations[msg.sender][uint(FieldOfWork.Organisational)] = msg.sender;
            delegations[msg.sender][uint(FieldOfWork.Finance)] = msg.sender;
            delegations[msg.sender][uint(FieldOfWork.Partnership)] = msg.sender;
            delegations[msg.sender][uint(FieldOfWork.Product)] = msg.sender;
            shareholders.push(msg.sender);
        }
        // execute an event reflecting the change
        MyTransfer(msg.sender, amount, bal);

        // ends function and returns
        return amount;
    }

    function delegate(FieldOfWork fieldOfWork, address recipient){
        // shareholder delegates to recipient ??
        if (!isShareholder(msg.sender))
        revert();
        delegations[msg.sender][uint(fieldOfWork)] = recipient;
    }

    function claimPayout(uint proposalNumber) icoFinished public returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender);

        balances[msg.sender] += proposal.amount;

        MyTransfer(msg.sender, proposal.amount, bal);
        return proposal.amount;
    }

    // function claimDividend(uint proposalNumber) public onlyShareholders {
    //     Proposal storage proposal = proposals[proposalNumber];

    //     require(proposal.finished && proposal.proposalPassed && !!proposal.dividend);

    //     balances[msg.sender] += balances[msg.sender] * proposal.dividend;
    // }

    function currentTime() returns (uint time) {
        if (dev) {
            return cTime;
        }
        else {
            return now;
        }
    }
    function setCurrentTime(uint time) {
        require(dev);

        cTime = time;
    }
    /*
        function sell(uint amount) returns (uint256 revenue){
            if (balances[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
            balances[owner] += amount;                         // adds the amount to owner's balance
            balances[msg.sender] -= amount;                   // subtracts the amount from seller's balance
            revenue = amount * sellPrice;
            if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's truimportant
                throw;                                         // to do owner last to prevent recursion attacks
            } else {
                Transfer(msg.sender, owner, amount);             // executes an event reflecting on the change
                return revenue;                                 // ends function and returns
            }
        }*/
}
