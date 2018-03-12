pragma solidity ^0.4.8;

import './DaoWithDelegation.sol';


contract GentoDao is DaoWithDelegation {
    string public descriptionHash;

    mapping(address => uint256) public dividends;
    mapping(address => uint256) public decisionmakerRewards;

    uint8 public finance = 25;
    uint8 public product = 25;
    uint8 public organisational = 25;
    uint8 public partner = 25;

    event Claimed(string claimType, address beneficiary, uint amount);
    event Balance(uint balance);

    function GentoDao(uint256 _maxAmountToRaiseInICO,
    string _symbol,
    string _name,
    string _descriptionHash,
    uint256 _buyPriceStart,
    uint256 _buyPriceEnd,
    uint256 _saleStart,
    uint256 _saleEnd,
    bool _dev) DaoWithDelegation(_maxAmountToRaiseInICO, _symbol, _name, _buyPriceStart, _buyPriceEnd, _saleStart, _saleEnd, _dev) public {
        descriptionHash = _descriptionHash;
    }

    function claimPayout(uint proposalNumber) public daoActive returns (uint amount) {
        Proposal storage proposal = proposals[proposalNumber];

        require(proposal.finished && proposal.proposalPassed && proposal.recipient == msg.sender
            && proposal.claimed == false && proposal.amount > 0);

        proposal.claimed = true;
        Claimed("payout", msg.sender, proposal.amount);
        require(msg.sender.send(proposal.amount));

        return proposal.amount;
    }

    function claimDividend() public onlyShareholders {
        require(dividends[msg.sender] > 0);
        uint dividend = dividends[msg.sender];
        dividends[msg.sender] = 0;
        require(msg.sender.send(dividend));

        Claimed("dividend", msg.sender, dividends[msg.sender]);
    }

    function claimDecisionMakerReward() public onlyShareholders {
        require(decisionmakerRewards[msg.sender] > 0);
        uint decisionmakerReward = decisionmakerRewards[msg.sender];
        decisionmakerRewards[msg.sender] = 0;
        require(msg.sender.send(decisionmakerReward));

        Claimed("decision maker reward", msg.sender, decisionmakerRewards[msg.sender]);
    }

    function getVRTokenInFoW(FieldOfWork fow) public constant returns(uint vrt) {
        uint vrt1 = 0;
        for (uint i = 0; i < shareholders.length; ++i) {
            if (votingRewardTokens[shareholders[i]][uint(fow)] > 0) {
                vrt1 += votingRewardTokens[shareholders[i]][uint(fow)];
            }
        }
        // check for 0 and setting to any number so the calculation doesn't throw
        if (vrt1 == 0) {
            vrt1 = 1;
        }
        return vrt1;
    }

    function getVRTokenInFoWOfDecisionMaker(address dm, FieldOfWork fow) public constant returns(uint vrt) {
        return votingRewardTokens[dm][uint(fow)];
    }

    function distributeDMReward(uint dmr) private {
        uint financeDmr = (dmr * finance) / 100;
        uint productDmr = (dmr * product) / 100;
        uint organisationalDmr = (dmr * organisational) / 100;
        uint partnerDmr = (dmr * partner) / 100;


        for (uint j = 0; j < shareholders.length; ++j) {
            uint financeReward = (financeDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Finance) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Finance))) / 100;
            uint organisationalReward = (organisationalDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Organisational) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Organisational))) / 100;
            uint productReward = (productDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Product) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Product))) / 100;
            uint partnerReward = (partnerDmr * ((getVRTokenInFoWOfDecisionMaker(shareholders[j], FieldOfWork.Partnership) * 10 ** 2) / getVRTokenInFoW(FieldOfWork.Partnership))) / 100;

            uint dmrSum = financeReward + productReward + organisationalReward + partnerReward;

            decisionmakerRewards[shareholders[j]] = dmrSum;
        }

        for (uint r = 0; r < shareholders.length; ++r) {
            votingRewardTokens[shareholders[r]][uint(FieldOfWork.Finance)] = 0;
            votingRewardTokens[shareholders[r]][uint(FieldOfWork.Product)] = 0;
            votingRewardTokens[shareholders[r]][uint(FieldOfWork.Organisational)] = 0;
            votingRewardTokens[shareholders[r]][uint(FieldOfWork.Partnership)] = 0;
        }
    }

    function distributeDividend(uint dividend) internal{
        for (uint i = 0; i < shareholders.length; ++i) {
            uint shareholderDividend = (dividend * balances[shareholders[i]] * (10 ** 3)) / totalSupply / (10 ** 3);
            dividends[shareholders[i]] += shareholderDividend;
        }
    }

    function executeProposal(uint proposalId) public votingAllowed {
        DaoWithProposals.executeProposal(proposalId);
        Proposal storage proposal = proposals[proposalId];
        for (uint i = 0; i < proposal.votes.length; ++i) {
            Vote storage v = proposal.votes[i];
            uint voteWeight = getInfluenceOfVoter(v.voter, proposal.fieldOfWork);
            votingRewardTokens[v.voter][uint(proposal.fieldOfWork)] += voteWeight;
        }
        // finished?
        if (proposal.proposalPassed) {
            if (proposal.dividend > 0) {
                distributeDividend(proposal.dividend);
            }
            if (proposal.dmr > 0) {
                distributeDMReward(proposal.dmr);
            }
        }
    }
}
