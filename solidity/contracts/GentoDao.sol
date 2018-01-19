pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';

contract GentoDao is DaoWithDelegation {

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;

    event Claimed(string claimType, uint proposalID, address beneficiary, bool claim);

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
            && proposal.claimed[msg.sender] == false && proposal.amount > 0);

        balances[msg.sender] += proposal.amount;
        proposal.claimed[msg.sender] = true;
        Claimed("payout", proposalNumber, msg.sender, proposal.claimed[msg.sender]);

        return proposal.amount;
    }
    // TODO the same user isn't allowed to claim the dividend again

    function claimDividend(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed
            && proposal.claimed[msg.sender] == false && proposal.dividend > 0);

        balances[msg.sender] += balances[msg.sender] * proposal.dividend;
        proposal.claimed[msg.sender] = true;
        Claimed("dividend", proposalNumber, msg.sender, proposal.claimed[msg.sender]);
    }

    function getVRTinFoW(FieldOfWork fow) public constant returns(uint vrt) {
        uint vrt1 = 0;
        for (uint i = 0; i < shareholders.length; i++) {
            if (votingRewardTokens[shareholders[i]][uint(fow)] > 0) {
                vrt1 += votingRewardTokens[shareholders[i]][uint(fow)];
            }
        }
        return vrt1;
    }

    function getVRTInFoWOfDM(address dm, FieldOfWork fow) public constant returns(uint vrt) {
        return votingRewardTokens[dm][uint(fow)];
    }

    function claimDMR(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.dmr != 0);

        balances[msg.sender] += (proposal.dmr * getVRTInFoWOfDM(msg.sender, proposal.fieldOfWork))
            / getVRTinFoW(proposal.fieldOfWork);
    }

    function executeProposal(uint proposalId) public votingAllowed {

        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];
        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
        }
    }
}
