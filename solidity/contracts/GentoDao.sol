pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';

contract GentoDao is DaoWithDelegation {

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;
    mapping(address => uint256) dividends;

    event Claimed(string claimType, uint proposalID, address beneficiary, bool claim);
    event Balance(uint balance);

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
    }

    function getTokenPrice() constant returns (uint tokenPrice) {
        tokenPrice = this.balance / totalSupply;
        return tokenPrice;
    }
    
    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
            && proposal.claimed[msg.sender] == false && proposal.amount > 0);

        transfer(msg.sender, proposal.amount);
        proposal.claimed[msg.sender] = true;
        Claimed("payout", proposalNumber, msg.sender, proposal.claimed[msg.sender]);

        return proposal.amount;
    }

    function claimDividend(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.dividend > 0 && dividends[msg.sender] > 0);
        transfer(msg.sender, dividends[msg.sender]);
        dividends[msg.sender] = 0;
        
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

    function getVotingRewardTokenInFoWOfDecisionMaker(address dm, FieldOfWork fow) public constant returns(uint vrt) {
        return votingRewardTokens[dm][uint(fow)];
    }

    function claimDecisionMakerReward(uint proposalNumber) public onlyShareholders {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.dmr != 0
            && proposal.claimed[msg.sender] == false);

        balances[msg.sender] += (proposal.dmr * getVRTInFoWOfDM(msg.sender, proposal.fieldOfWork))
            / getVRTinFoW(proposal.fieldOfWork);
        proposal.claimed[msg.sender] = true;
        Balance(balances[msg.sender]);
        Claimed("decision maker reward", proposalNumber, msg.sender, proposal.claimed[msg.sender]);
    }

    function executeProposal(uint proposalId) public votingAllowed {

        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];
        if (proposal.dividend > 0) {
            tokenPrice = getTokenPrice();
            for (uint i = 0; i < shareholders.length; ++i) {
                shareholderDividend = (balances[shareholders[i]] * tokenPrice) * proposal.dividend;
                dividends[shareholders[i]] += shareholderDividend;
            }
        }

        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
        }
    }
}
