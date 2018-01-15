pragma solidity ^0.4.8;

import './Proposals.sol';
import './Ico.sol';

contract GentoDao is Ico, Proposals {


    string public symbol = "";
    string public name = "";

    uint256 public creationDate;

    uint8 public constant decimals = 18;
    uint256 totalSupply = 0;

    address[] public shareholders;

    bool dev;
    uint cTime;

    mapping(address => mapping(uint => address)) delegations;

    event MyTransfer(address indexed to, uint256 value, uint256 remainingSupply);
    event PayoutResetted(uint256 payout);

    modifier daoActive {
        // DAO is active once the ICO is done
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

    function isIcoFinished() returns (bool icoFinished){
        return saleEnd <= currentTime();
    }


    function initShareholder(address shareholder){
        delegations[shareholder][uint(FieldOfWork.Organisational)] = shareholder;
        delegations[shareholder][uint(FieldOfWork.Finance)] = shareholder;
        delegations[shareholder][uint(FieldOfWork.Partnership)] = shareholder;
        delegations[shareholder][uint(FieldOfWork.Product)] = shareholder;
        shareholders.push(shareholder);
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


    function delegate(FieldOfWork fieldOfWork, address recipient){
        // shareholder delegates to recipient ??
        if (!isShareholder(msg.sender))
        revert();
        delegations[msg.sender][uint(fieldOfWork)] = recipient;
    }
    // ensure that the method can be inoked only once
    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender && proposal.amount != 0);

        proposal.amount = 0;
        PayoutResetted(proposal.amount);

        balances[msg.sender] += proposal.amount;

        MyTransfer(msg.sender, proposal.amount, bal);
        return proposal.amount;
    }

    function claimDividend(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed /*&& proposal.dividend > 0*/);
        // msg.sender oder claimer?
        balances[msg.sender] += balances[msg.sender] /** proposal.dividend*/;
    }

    function isShareholder(address userAddress) returns (bool shareholder){
        return balances[userAddress] > 0;
    }

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
}
