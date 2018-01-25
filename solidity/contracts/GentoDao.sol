pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';

contract GentoDao is DaoWithDelegation {

    mapping(address => mapping(uint => uint256)) public votingRewardTokens;
    mapping(address => uint256) dividends;
    mapping(address => uint256) decicionmakerRewards;

    uint8 finance;
    uint8 product;
    uint8 organisational;
    uint8 partner;

    event Claimed(string claimType, address beneficiary);
    event Balance(uint balance);

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    uint8 _finance,
    uint8 _product,
    uint8 _organisational,
    uint8 _partner
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
        finance = _finance;
        product = _product;
        organisational = _organisational;
        partner = _partner;
    }

    function getTokenPrice() constant returns (uint tokenPrice) {
        uint256 tokenPrice = this.balance / totalSupply;
        return tokenPrice;
    }

    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
            && proposal.claimed[msg.sender] == false && proposal.amount > 0);

        require(msg.sender.send(proposal.amount));
        proposal.claimed[msg.sender] = true;
        Claimed("payout", msg.sender);

        return proposal.amount;
    }

    function claimDividend() public onlyShareholders {
        require(dividends[msg.sender] > 0);
        dividends[msg.sender] = 0;
        require(msg.sender.send(dividends[msg.sender]));
        
        Claimed("dividend", msg.sender);
    }


    function claimDecisionMakerReward() public onlyShareholders {
        require(decisionmakerRewards[msg.sender] > 0);
        decisionmakerRewards[msg.sender] = 0;
        require(msg.sender.send(decicionmakerRewards[msg.sender]));

        Claimed("decision maker reward", msg.sender);
    }

    function getVRTokeninFoW(FieldOfWork fow) public constant returns(uint vrt) {
        uint vrt1 = 0;
        for (uint i = 0; i < shareholders.length; i++) {
            if (votingRewardTokens[shareholders[i]][uint(fow)] > 0) {
                vrt1 += votingRewardTokens[shareholders[i]][uint(fow)];
            }
        }
        return vrt1;
    }

    function getVRTokenOfDecisionMaker(address dm, FieldOfWork fow) public constant returns(uint vrt) {
        return votingRewardTokens[dm][uint(fow)];
    }

    function executeProposal(uint proposalId) public votingAllowed {

        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];
        if (proposal.proposalPassed && proposal.dividend > 0) {
            tokenPrice = getTokenPrice();
            for (uint i = 0; i < shareholders.length; ++i) {
                shareholderDividend = (balances[shareholders[i]] * tokenPrice) * proposal.dividend;
                dividends[shareholders[i]] += shareholderDividend;
            }
        }

        if (proposal.proposalPassed && proposal.dmr > 0) {
            uint financeDmr = (proposal.dmr * finance) / 100;
            uint productDmr = (proposal.dmr * product) / 100;
            uint organisationalDmr = (proposal.dmr * organisational) / 100;
            uint partnerDmr = (proposal.dmr * partner) / 100;


            for (uint i = 0; i < shareholders.length; ++i) {
                uint financeReward = (financeDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[i], FieldOfWork.finance) / getVRTinFoW(FieldOfWork.finance)) * 100)) / 100;
                uint productReward = (productDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[i], FieldOfWork.product) / getVRTinFoW(FieldOfWork.product)) * 100)) / 100;
                uint organisationalReward = (organisationalDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[i], FieldOfWork.organisational) / getVRTinFoW(FieldOfWork.organisational)) * 100)) / 100;
                uint partnerReward = (partnerDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[i], FieldOfWork.partner) / getVRTinFoW(FieldOfWork.partner)) * 100)) / 100;
                uint dmr = financeReward + productReward + organisationalReward + partnerReward;

                decisionmakerRewards[shareholders[i]] += dmr;

                votingRewardTokens[shareholders[i]][FieldOfWork.finance] = 0;
                votingRewardTokens[shareholders[i]][FieldOfWork.product] = 0;
                votingRewardTokens[shareholders[i]][FieldOfWork.organisational] = 0;
                votingRewardTokens[shareholders[i]][FieldOfWork.partner] = 0;
            }
        }

        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
        }
    }
}
