pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';

contract GentoDao is DaoWithDelegation {

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
    }
    // ensure that the method can be inoked only once
    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
          && proposal.amount != 0);

        balances[msg.sender] += proposal.amount;
        proposal.amount = 0;


        return proposal.amount;
    }
    // TODO the same user isn't allowed to claim the dividend again
    function claimDividend(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.dividend != 0);

        balances[msg.sender] += balances[msg.sender] * proposal.dividend;
    }

    function executeProposal(uint proposalId) public votingAllowed
    {
      DaoWithProposals.executeProposal(proposalId);
      Proposal storage proposal = proposals[proposalId];
      for (uint i = 0; i < proposal.votes.length; ++i) {
        Vote storage v = proposal.votes[i];
        uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
        votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
      }
    }
}
