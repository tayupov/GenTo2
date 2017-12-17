pragma solidity ^0.4.8;

import '../../node_modules/zeppelin-solidity/contracts/token/StandardToken.sol';

contract VotingToken is StandardToken {


    uint cTime;
    address public owner;
    address dao;
    string name;
    uint256 fieldOfWork; // TODO replace with enum
    bool dev;


    uint256 public creationDate;

    function AuctionToken(uint256 _totalSupply,
    address _owner,
    address _dao,
    string _name,
    uint256 _fieldOfWork, // TODO replace with enum
    bool _dev) {
        owner = _owner;
        dao = _dao;
        fieldOfWork = _fieldOfWork;
        name = _name;
        dev = _dev;
        if (_dev) {
            creationDate = 0;
        }
        else {
            creationDate = now;
        }
    }

    function vote() payable returns (bool success) {
        return true;
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
        cTime = time;
    }
}
