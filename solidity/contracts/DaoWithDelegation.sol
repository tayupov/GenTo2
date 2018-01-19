pragma solidity ^0.4.8;

import './DaoWithProposals.sol';
contract DaoWithDelegation is DaoWithProposals {
  mapping(address => mapping(uint => address)) public delegations;

  function DaoWithDelegation(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithProposals(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
  }

  function getInfluenceOfVoter(address voter, FieldOfWork fieldOfWork) public constant returns (uint influence){
      uint influence1 = 0;
      for (uint i = 0; i < shareholders.length; ++i) {
          if (delegations[shareholders[i]][uint(fieldOfWork)] == voter){
              influence1 += balances[shareholders[i]];
          }
      }
      if (delegations[voter][uint(fieldOfWork)] == address(0)) {
        influence1 += balances[voter];
      }

      return influence1;
  }

  function delegate(FieldOfWork fieldOfWork, address recipient) public {
      // shareholder delegates to recipient ??
      require(isShareholder(msg.sender));

      delegations[msg.sender][uint(fieldOfWork)] = recipient;
  }

}
