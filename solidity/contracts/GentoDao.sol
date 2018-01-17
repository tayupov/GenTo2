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
    function claimPayout(uint proposalNumber, address claimer) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == claimer);

        balances[msg.sender] += proposal.amount;

        return proposal.amount;
    }

    function claimDividend(uint proposalNumber, address claimer) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed /*&& !!proposal.dividend*/);
        // msg.sender oder claimer?
        balances[msg.sender] += balances[claimer] /** proposal.dividend*/;
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
